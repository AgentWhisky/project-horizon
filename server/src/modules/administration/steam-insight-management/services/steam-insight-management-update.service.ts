import { HttpModuleAsyncOptions, HttpService } from '@nestjs/axios';
import { ConflictException, ForbiddenException, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { CronJob } from 'cron';
import { firstValueFrom } from 'rxjs';

import { SteamInsightUpdateStatus, SteamInsightUpdateType } from '@hz/common/enums';
import { ChangeDiff } from '@hz/common/model';
import { sleep, getErrorNameAndMessage, generateChangeDiff, formatETFromNow } from '@hz/common/utils';

import { SteamAppEntity } from '@hz/entities/steam-app.entity';
import { SteamAppAuditEntity, SteamAppChangeType } from '@hz/entities/steam-app-audit.entity';
import { SteamUpdateHistoryEntity } from '@hz/entities/steam-update-history.entity';

import { AppInfoResult, SteamAppAchievements, SteamAppInfo, SteamListApp } from '../resources/steam-insight-management.model';
import { generateEventAppend, generateEventMessage, isAdultGame } from '../steam-insight-management.utils';
import {
  SteamApiKeyError,
  SteamApiMaxPageError,
  SteamAppInfoError,
  SteamUpdateCanceledError,
  SteamUpdateDisabledError,
  SteamUpdateInProgressError,
} from '../resources/steam-insight-management.error';
import {
  APP_SAVE_TYPE,
  APP_TYPE,
  MAX_STEAM_API_PAGES,
  MAX_STEAM_API_RETRIES,
  STEAM_API_RETRY_DELAY,
  STEAM_API_URLS,
  STEAM_UPDATE_ERRORS,
  STEAM_UPDATE_MESSAGES,
} from '../resources/steam-insight-management.constants';
import { POSTGRES_ERRORS } from '@hz/common/constants';
import { RetryExhaustedError } from '@hz/common/errors';

@Injectable()
export class SteamInsightManagementUpdateService implements OnModuleInit {
  private readonly logger = new Logger(SteamInsightManagementUpdateService.name);

  private isUpdateEnabled = false;
  private isUpdateCronEnabled = false;

  private updatePromise: Promise<void> | null = null;
  private updateHistoryId: number | null = null;

  private abortController?: AbortController;

  constructor(
    private schedulerRegistry: SchedulerRegistry,
    private readonly httpService: HttpService,

    @InjectRepository(SteamAppEntity)
    private readonly steamAppRepository: Repository<SteamAppEntity>,

    @InjectRepository(SteamAppAuditEntity)
    private readonly steamAppAuditRepository: Repository<SteamAppAuditEntity>,

    @InjectRepository(SteamUpdateHistoryEntity)
    private readonly steamUpdateHistoryRepository: Repository<SteamUpdateHistoryEntity>
  ) {}

  onModuleInit() {
    this.cleanupHistory();

    this.isUpdateEnabled = process.env.STEAM_UPDATE_ENABLE === 'true';
    this.isUpdateCronEnabled = process.env.STEAM_UPDATE_CRON_ENABLE === 'true';

    // If updates and update CRON are enabled
    if (this.isUpdateEnabled && this.isUpdateCronEnabled) {
      const job = new CronJob(CronExpression.EVERY_HOUR, async () => {
        await this.startUpdate(true, SteamInsightUpdateType.INCREMENTAL);
      });

      this.schedulerRegistry.addCronJob('steamInsightUpdateJob', job);
      job.start();

      this.logger.log(`Steam insight updates are enabled on this server and an update CRON job will run every hour`);
    } else if (this.isUpdateEnabled) {
      this.logger.warn(`Steam insight updates are enabled on this server but the update CRON job is disabled`);
    } else {
      this.logger.warn(`Steam insight updates are disabled on this server`);
    }
  }

  /**
   * Start a Steam Insight Update
   * @param isCron Whether the update trigger is a CRON job or manual
   * @param updateType If the update is FULL 'F' or INCREMENTAL 'I'
   */
  async startUpdate(isCron?: boolean, updateType?: SteamInsightUpdateType) {
    if (!this.isUpdateEnabled) {
      if (isCron) {
        this.logger.warn(`[Cron] ${STEAM_UPDATE_ERRORS.updatesDisabledError}`);
      } else {
        throw new ForbiddenException(STEAM_UPDATE_ERRORS.updatesDisabledError);
      }
    }

    if (this.updatePromise) {
      if (isCron) {
        this.logger.warn(`[Cron] ${STEAM_UPDATE_ERRORS.updateInProgressError}`);
      } else {
        throw new ConflictException(STEAM_UPDATE_ERRORS.updateInProgressError);
      }
    }

    this.abortController = new AbortController();

    // Clear updatePromise on completion to track in-progress updates
    this.updatePromise = this.update(updateType).finally(() => {
      this.updatePromise = null;
      this.updateHistoryId = null;
    });

    return { message: STEAM_UPDATE_MESSAGES.updateQueued };
  }

  async stopUpdate() {
    if (this.abortController) {
      this.abortController.abort();
    }

    // Only cleanup history if the server is not tracking an in-progress update
    if (this.updatePromise) {
      return { message: 'Cancel request received for update in progress' };
    }

    await this.cleanupHistory();
    throw new ConflictException('No update in progress to cancel');
  }

  private async update(updateType: SteamInsightUpdateType = SteamInsightUpdateType.FULL) {
    const statsCounter = {
      games: { inserts: 0, updates: 0, noChange: 0 },
      dlc: { inserts: 0, updates: 0, noChange: 0 },
      errors: 0,
      total: 0,
    };

    try {
      if (!this.isUpdateEnabled) {
        throw new SteamUpdateDisabledError();
      }

      this.logger.log(STEAM_UPDATE_MESSAGES.updateStarted);

      // Create Update History Record
      const updateRecord = this.steamUpdateHistoryRepository.create({
        updateType,
        updateStatus: SteamInsightUpdateStatus.RUNNING,
        startTime: new Date(),
        events: [generateEventMessage(STEAM_UPDATE_MESSAGES.updateStarted)],
      });

      let updateHistoryRecord: SteamUpdateHistoryEntity;
      try {
        updateHistoryRecord = await this.steamUpdateHistoryRepository.save(updateRecord);
      } catch (error) {
        // Postgres Integrity Constraint Violation - Unique Violation (Only allow one running update)
        if (error?.code === POSTGRES_ERRORS.uniqueViolation) {
          const failedRecord = this.steamUpdateHistoryRepository.create({
            updateType,
            updateStatus: SteamInsightUpdateStatus.FAILED,
            startTime: new Date(),
            endTime: new Date(),
            events: [generateEventMessage(STEAM_UPDATE_ERRORS.updateInProgressError)],
            notes: STEAM_UPDATE_ERRORS.updateInProgressError,
          });
          await this.steamUpdateHistoryRepository.save(failedRecord);

          throw new SteamUpdateInProgressError();
        }
        throw error;
      }

      this.updateHistoryId = updateHistoryRecord.id;
      await this.checkForCancellation();

      let lastCompleteStartTime: Date | null = null;
      if (updateType !== SteamInsightUpdateType.FULL) {
        // Get Most Recent complete update start time
        const lastCompleteRecord = await this.steamUpdateHistoryRepository.findOne({
          where: { updateStatus: SteamInsightUpdateStatus.COMPLETE },
          order: { startTime: 'DESC' },
        });
        lastCompleteStartTime = lastCompleteRecord?.startTime ?? null;
      }

      await this.checkForCancellation();

      if (lastCompleteStartTime) {
        await this.appendEvent(this.updateHistoryId, `Retrieving apps updated after ${lastCompleteStartTime?.toISOString() ?? 'N/A'}`);
      } else {
        await this.appendEvent(this.updateHistoryId, `Retrieving full apps list`);
      }

      // Get steam update list of apps
      const appList = await this.getAppList(lastCompleteStartTime);

      await this.checkForCancellation();

      if (lastCompleteStartTime) {
        await this.appendEvent(
          this.updateHistoryId,
          `Retrieved ${appList.length} apps to update after ${lastCompleteStartTime?.toISOString() ?? 'N/A'}`
        );
      } else {
        await this.appendEvent(this.updateHistoryId, `Retrieved ${appList.length} apps to update`);
      }

      let appCount = 0;
      for (const app of appList) {
        appCount++;

        if (appCount % 10000 === 0) {
          await this.appendEvent(this.updateHistoryId, `Updated ${appCount}/${appList.length} apps`);
        }

        await this.checkForCancellation();
        const appid = app.appid;

        try {
          const appInfo = await this.getAppInfo(appid);

          let appAchievements: SteamAppAchievements | null = null;
          if (appInfo.type === APP_TYPE.game) {
            appAchievements = await this.getAppAchievements(appid);
          }

          const result = await this.saveAppInfo(app, appInfo, appAchievements, this.updateHistoryId);

          // Increment counters for each save type
          if (result.appType === APP_TYPE.game && result.saveType === APP_SAVE_TYPE.insert) {
            statsCounter.games.inserts++;
          } else if (result.appType === APP_TYPE.game && result.saveType === APP_SAVE_TYPE.update) {
            statsCounter.games.updates++;
          } else if (result.appType === APP_TYPE.game && result.saveType === APP_SAVE_TYPE.noChange) {
            statsCounter.games.noChange++;
          } else if (result.appType === APP_TYPE.dlc && result.saveType === APP_SAVE_TYPE.insert) {
            statsCounter.dlc.inserts++;
          } else if (result.appType === APP_TYPE.dlc && result.saveType === APP_SAVE_TYPE.update) {
            statsCounter.dlc.updates++;
          } else if (result.appType === APP_TYPE.dlc && result.saveType === APP_SAVE_TYPE.noChange) {
            statsCounter.dlc.noChange++;
          }
        } catch (error) {
          // Failures if they exist should set app as validation_failed
          try {
            const existing = await this.steamAppRepository.findOneBy({ appid: app.appid });
            if (existing) {
              await this.steamAppRepository.update({ appid: app.appid }, { validationFailed: true });

              await this.steamAppAuditRepository.save({
                appid: app.appid,
                updateHistoryId: this.updateHistoryId,
                changeType: SteamAppChangeType.UPDATE,
                changes: {
                  validationFailed: { before: existing.validationFailed, after: true },
                },
                notes: getErrorNameAndMessage(error),
              });
            }
          } catch {}

          statsCounter.errors++;
        } finally {
          statsCounter.total++;
        }
      }
      await this.appendEvent(this.updateHistoryId, `Finished updating Steam apps`);

      // Final cleanup and completion of update
      await this.steamUpdateHistoryRepository.update(
        {
          id: this.updateHistoryId,
        },
        {
          updateStatus: SteamInsightUpdateStatus.COMPLETE,
          endTime: new Date(),
          stats: statsCounter,
          events: generateEventAppend(STEAM_UPDATE_MESSAGES.updateComplete),
          notes: STEAM_UPDATE_MESSAGES.updateComplete,
        }
      );

      this.logger.log(STEAM_UPDATE_MESSAGES.updateComplete);
    } catch (error) {
      if (error instanceof SteamUpdateCanceledError) {
        this.logger.warn(STEAM_UPDATE_MESSAGES.updateCanceled);

        await this.steamUpdateHistoryRepository.update(
          {
            id: this.updateHistoryId,
          },
          {
            updateStatus: SteamInsightUpdateStatus.CANCELED,
            endTime: new Date(),
            stats: statsCounter,
            events: generateEventAppend(STEAM_UPDATE_MESSAGES.updateCanceled),
            notes: STEAM_UPDATE_MESSAGES.updateCanceled,
          }
        );

        return;
      } else if (error instanceof SteamUpdateDisabledError) {
        this.logger.warn(STEAM_UPDATE_ERRORS.updatesDisabledError);
      }

      if (this.updateHistoryId) {
        await this.steamUpdateHistoryRepository.update(
          {
            id: this.updateHistoryId,
          },
          {
            updateStatus: SteamInsightUpdateStatus.FAILED,
            endTime: new Date(),
            stats: statsCounter,
            events: generateEventAppend(getErrorNameAndMessage(error)),
            notes: getErrorNameAndMessage(error),
          }
        );
      }
    } finally {
      this.abortController = null;
    }
  }

  /**
   * Clean up database update history by setting all running updates to canceled
   * if the server is not tracking them
   */
  private async cleanupHistory() {
    const runningUpdates = await this.steamUpdateHistoryRepository.find({
      where: { updateStatus: SteamInsightUpdateStatus.RUNNING },
    });

    if (runningUpdates.length > 0) {
      await this.steamUpdateHistoryRepository.update(
        { updateStatus: SteamInsightUpdateStatus.RUNNING },
        {
          updateStatus: SteamInsightUpdateStatus.CANCELED,
          endTime: new Date(),
          events: generateEventAppend(STEAM_UPDATE_MESSAGES.updateCanceled),
          notes: STEAM_UPDATE_MESSAGES.updateCanceled,
        }
      );
    }
  }

  /**
   * Check and handle update cancelation
   * @param updateHistoryId The id of the update history record to cancel
   * @returns Nothing if the process is not canceled, throws a SteamUpdateCanceledError on cancellation
   */
  private async checkForCancellation() {
    if (!this.abortController.signal.aborted) {
      return;
    }

    throw new SteamUpdateCanceledError();
  }

  /**
   * Append an event to an update history events array
   * @param updateHistoryId Id of the update history entry record
   * @param message The event message to append
   */
  private async appendEvent(updateHistoryId: number, message: string) {
    await this.steamUpdateHistoryRepository.update(
      { id: updateHistoryId },
      {
        events: generateEventAppend(message),
      }
    );
  }

  /**
   * Save App info to database with given information
   * @param app Primary app info retrieved from app list
   * @param appInfo App details returned from details endpoint
   * @param appAchievements App achievements returned from schema endpoint
   * @param updateHistoryId Update history record id of current update
   * @returns An app info result containing the appid, type of app (game, dlc, etc), and update type (insert or update)
   */
  private async saveAppInfo(
    app: SteamListApp,
    appInfo: SteamAppInfo,
    appAchievements: SteamAppAchievements,
    updateHistoryId: number
  ): Promise<AppInfoResult> {
    // Every change to steam_apps table has a corresponding insert to the audit table with a given update history id
    const existing = await this.steamAppRepository.findOne({
      where: { appid: app.appid },
      select: {
        appid: true,
        name: true,
        lastModified: true,
        achievements: { total: true, data: true },
        type: true,
        requiredAge: true,
        isFree: true,
        recommendationsTotal: true,
        comingSoon: true,
        releaseDate: true,
        supportUrl: true,
        supportEmail: true,
        contentDescriptorNotes: true,
        dlc: true,
        packages: true,
        contentDescriptorIds: true,
        developers: true,
        publishers: true,
        categories: true,
        genres: true,
        detailedDescription: true,
        aboutTheGame: true,
        shortDescription: true,
        supportedLanguages: true,
        reviews: true,
        legalNotice: true,
        screenshots: true,
        movies: true,
        ratings: {
          esrb: { rating: true, descriptors: true, required_age: true, use_age_gate: true, interactive_elements: true },
          dejus: { rating: true, descriptors: true, required_age: true, use_age_gate: true, interactive_elements: true },
          pegi: { rating: true, descriptors: true, required_age: true, use_age_gate: true, interactive_elements: true },
          usk: { rating: true, descriptors: true, required_age: true, use_age_gate: true, interactive_elements: true },
          nzoflc: { rating: true, descriptors: true, required_age: true, use_age_gate: true, interactive_elements: true },
          fpb: { rating: true, descriptors: true, required_age: true, use_age_gate: true, interactive_elements: true },
          csrr: { rating: true, descriptors: true, required_age: true, use_age_gate: true, interactive_elements: true },
          cero: { rating: true, descriptors: true, required_age: true, use_age_gate: true, interactive_elements: true },
          crl: { rating: true, descriptors: true, required_age: true, use_age_gate: true, interactive_elements: true },
        },
        packageGroups: true,
        demos: true,
        fullgame: { appid: true, name: true },
        headerImage: true,
        capsuleImage: true,
        capsuleImagev5: true,
        website: true,
        backgroundUrl: true,
        backgroundRawUrl: true,
        pcMinimum: true,
        pcRecommended: true,
        macMinimum: true,
        macRecommended: true,
        linuxMinimum: true,
        linuxRecommended: true,
        supportsWindows: true,
        supportsMac: true,
        supportsLinux: true,
        currency: true,
        initialPrice: true,
        finalPrice: true,
        discountPercent: true,
        initialFormatted: true,
        finalFormatted: true,
        metacriticScore: true,
        metacriticUrl: true,
        isAdult: true,
      },
    });

    const entity = this.steamAppRepository.create({
      appid: app.appid,
      name: app.name,
      lastModified: new Date(app.last_modified * 1000),
      achievements: appAchievements,
      type: appInfo.type,
      requiredAge: parseInt((appInfo.required_age || '0').toString().replace('+', '')),
      isFree: !!appInfo.is_free,
      recommendationsTotal: appInfo.recommendations?.total,
      comingSoon: appInfo.release_date?.coming_soon,
      releaseDate: appInfo.release_date?.date,
      supportUrl: appInfo.support_info?.url,
      supportEmail: appInfo.support_info?.email,
      contentDescriptorNotes: appInfo.content_descriptors?.notes,
      dlc: appInfo.dlc ?? [],
      packages: appInfo.packages ?? [],
      contentDescriptorIds: appInfo.content_descriptors?.ids ?? [],
      developers: appInfo.developers ?? [],
      publishers: appInfo.publishers ?? [],
      categories: appInfo.categories?.map((c) => c.description) ?? [],
      genres: appInfo.genres?.map((g) => g.description) ?? [],
      detailedDescription: appInfo.detailed_description,
      aboutTheGame: appInfo.about_the_game,
      shortDescription: appInfo.short_description,
      supportedLanguages: appInfo.supported_languages,
      reviews: appInfo.reviews,
      legalNotice: appInfo.legal_notice,
      screenshots: appInfo.screenshots ?? [],
      movies: appInfo.movies ?? [],
      ratings: appInfo.ratings,
      packageGroups: appInfo.package_groups ?? [],
      demos: appInfo.demos ?? [],
      fullgame: Array.isArray(appInfo.fullgame) ? appInfo.fullgame[0] : (appInfo.fullgame ?? null),
      headerImage: appInfo.header_image,
      capsuleImage: appInfo.capsule_image,
      capsuleImagev5: appInfo.capsule_imagev5,
      website: appInfo.website,
      backgroundUrl: appInfo.background,
      backgroundRawUrl: appInfo.background_raw,
      pcMinimum: appInfo.pc_requirements?.minimum,
      pcRecommended: appInfo.pc_requirements?.recommended,
      macMinimum: appInfo.mac_requirements?.minimum,
      macRecommended: appInfo.mac_requirements?.recommended,
      linuxMinimum: appInfo.linux_requirements?.minimum,
      linuxRecommended: appInfo.linux_requirements?.recommended,
      supportsWindows: appInfo.platforms?.windows ?? false,
      supportsMac: appInfo.platforms?.mac ?? false,
      supportsLinux: appInfo.platforms?.linux ?? false,
      currency: appInfo.price_overview?.currency,
      initialPrice: appInfo.price_overview?.initial,
      finalPrice: appInfo.price_overview?.final,
      discountPercent: appInfo.price_overview?.discount_percent,
      initialFormatted: appInfo.price_overview?.initial_formatted,
      finalFormatted: appInfo.price_overview?.final_formatted,
      metacriticScore: appInfo.metacritic?.score,
      metacriticUrl: appInfo.metacritic?.url,
      isAdult: isAdultGame(appInfo),
    });

    const changes: ChangeDiff = existing ? generateChangeDiff(existing, entity) : generateChangeDiff(null, entity);

    if (existing) {
      // Return without updating as there are no changes
      if (Object.keys(changes).length === 0) {
        return {
          appid: app.appid,
          appType: appInfo.type,
          saveType: APP_SAVE_TYPE.noChange,
        };
      }

      // Check if record needs to be moved between partitions
      if (existing && existing.isAdult !== entity.isAdult) {
        await this.steamAppRepository.delete({ appid: entity.appid });
      }

      await this.steamAppRepository.save(entity);

      await this.steamAppAuditRepository.save({
        appid: entity.appid,
        updateHistoryId,
        changeType: SteamAppChangeType.UPDATE,
        changes,
      });

      return {
        appid: app.appid,
        appType: appInfo.type,
        saveType: APP_SAVE_TYPE.update,
      };
    } else {
      await this.steamAppRepository.save(entity);

      await this.steamAppAuditRepository.save({
        appid: entity.appid,
        updateHistoryId,
        changeType: SteamAppChangeType.INSERT,
        changes,
      });

      return {
        appid: app.appid,
        appType: appInfo.type,
        saveType: APP_SAVE_TYPE.insert,
      };
    }
  }

  /**
   * Retrieve the list of steam apps (games and dlc) optionally after a last modified date or last appid
   * @param lastModified The last modified date to retrieve apps updated after
   * @param lastAppid The last appid before the app list
   * @returns The list of retrieved Steam list apps
   */
  private async getAppList(lastModified?: Date, lastAppid?: number): Promise<SteamListApp[]> {
    if (!process.env.STEAM_API_KEY) {
      throw new SteamApiKeyError(STEAM_UPDATE_ERRORS.apiKeyNotFoundError);
    }

    const params: Record<string, any> = {
      key: process.env.STEAM_API_KEY,
      max_results: 50000,
      include_games: 'True',
      include_dlc: 'True',
    };

    if (lastModified) {
      const lastModifiedEpoch = Math.floor(lastModified.valueOf() / 1000);
      params.if_modified_since = lastModifiedEpoch;
    }

    if (lastAppid) {
      params.last_appid = lastAppid;
    }

    const appList: SteamListApp[] = [];
    let pageCount = 0;

    while (true) {
      await this.checkForCancellation();
      let success = false;

      // Prevent Infinite Paging Loop
      pageCount++;
      if (pageCount > MAX_STEAM_API_PAGES) {
        throw new SteamApiMaxPageError();
      }

      for (let attempt = 0; attempt < MAX_STEAM_API_RETRIES; attempt++) {
        try {
          const response = await firstValueFrom(this.httpService.get(STEAM_API_URLS.list, { params, signal: this.abortController.signal }));
          const data = response?.data?.response;

          const apps: SteamListApp[] = data?.apps ?? [];

          const nextLastAppid: number | null = data?.last_appid;
          const haveMoreResults: number | null = data?.have_more_results;

          /**
           * Retry a call with 0 app results
           * - High chance its an API error and not the true results
           * - Retry after 5s delay
           */
          if (apps.length === 0) {
            this.logger.warn(
              `[GetAppList] Empty page at page=${pageCount}, attempt=${attempt + 1}/${MAX_STEAM_API_RETRIES}, last_appid=${params.last_appid}`
            );
            await sleep(STEAM_API_RETRY_DELAY.error, this.abortController.signal, SteamUpdateCanceledError);
            continue;
          }

          appList.push(...apps);

          // Log Response
          this.logger.log(
            `[GetAppList] Page ${pageCount} retrieved ${apps.length} apps, last_appid=${nextLastAppid}, have_more_results=${haveMoreResults}`
          );

          // If nextLastAppid is not given, return list
          if (!nextLastAppid) {
            return appList;
          }

          params.last_appid = nextLastAppid ?? 0;

          success = true;
          break;
        } catch (error) {
          const status = error?.response?.status;

          // Steam API Key has been rejected and is either invalidated or expired
          if (status === 403) {
            throw new SteamApiKeyError(STEAM_UPDATE_ERRORS.apiKeyRejectedError);
          }

          // Retry all other error types
          if (status === 429) {
            this.logger.warn(`[GetAppList] API rate limit reached - retrying at ${formatETFromNow(STEAM_API_RETRY_DELAY.rateLimit)}`);

            await sleep(STEAM_API_RETRY_DELAY.rateLimit, this.abortController.signal, SteamUpdateCanceledError);
          } else {
            await sleep(STEAM_API_RETRY_DELAY.error, this.abortController.signal, SteamUpdateCanceledError);
          }
        }
      }

      if (!success) {
        throw new RetryExhaustedError(`Failed to retrieve app list after ${MAX_STEAM_API_RETRIES} attempts`);
      }
    }
  }

  /**
   * Get steam app info for a given appid from the Steam API
   * @param appid The given appid for a steam app
   * @returns The retrieved app info or null on failure
   */
  private async getAppInfo(appid: number): Promise<SteamAppInfo> {
    const params = {
      appids: appid,
      cc: 'us',
      l: 'english',
    };

    for (let attempt = 0; attempt < MAX_STEAM_API_RETRIES; attempt++) {
      await this.checkForCancellation();

      try {
        const response = await firstValueFrom(this.httpService.get(STEAM_API_URLS.info, { params, signal: this.abortController.signal }));
        const result = response?.data?.[String(appid)];

        if (!result?.success) {
          throw new SteamAppInfoError(appid);
        }

        const appInfo: SteamAppInfo = response?.data?.[String(appid)]?.data;
        if (!appInfo) {
          throw new SteamAppInfoError(appid);
        }

        return appInfo ?? null;
      } catch (error) {
        if (error instanceof SteamUpdateCanceledError) {
          throw error;
        }

        const status = error?.response?.status;

        // Immediately throw a SteamAppInfoError to prevent unnecessary retries
        if (error instanceof SteamAppInfoError) {
          throw error;
        }

        // Retry all other error types
        if (status === 429) {
          this.logger.warn(`[GetAppInfo] API rate limit reached - retrying at ${formatETFromNow(STEAM_API_RETRY_DELAY.rateLimit)}`);

          await sleep(STEAM_API_RETRY_DELAY.rateLimit, this.abortController.signal, SteamUpdateCanceledError);
        } else {
          this.logger.warn(
            `[GetAppInfo] Attempt ${attempt + 1}/${MAX_STEAM_API_RETRIES} failed for appid: ${appid} - ${getErrorNameAndMessage(error)}`
          );

          await sleep(STEAM_API_RETRY_DELAY.error, this.abortController.signal, SteamUpdateCanceledError);
        }
      }
    }

    throw new RetryExhaustedError(`Failed to retrieve app info after ${MAX_STEAM_API_RETRIES} attempts`);
  }

  private async getAppAchievements(appid: number): Promise<SteamAppAchievements | null> {
    const params = {
      key: process.env.STEAM_API_KEY,
      appid,
      l: 'english',
    };

    for (let attempt = 0; attempt < MAX_STEAM_API_RETRIES; attempt++) {
      await this.checkForCancellation();

      try {
        const response = await firstValueFrom(this.httpService.get(STEAM_API_URLS.schema, { params, signal: this.abortController.signal }));
        const achievements = response?.data?.game?.availableGameStats?.achievements;

        // Check if app retrieved no achievements
        if (!achievements) {
          return null;
        }

        return {
          total: achievements.length,
          data: achievements,
        };
      } catch (error) {
        if (error instanceof SteamUpdateCanceledError) {
          throw error;
        }

        const status = error?.response?.status;

        if (status === 400) {
          return null;
        }

        // Immediately throw a SteamAppInfoError to prevent unnecessary retries
        if (status === 403) {
          throw new SteamApiKeyError(STEAM_UPDATE_ERRORS.apiKeyRejectedError);
        }

        // Retry all other error types
        if (status === 429) {
          this.logger.warn(`[GetAppAchievements] API rate limit reached - retrying at ${formatETFromNow(STEAM_API_RETRY_DELAY.rateLimit)}`);

          await sleep(STEAM_API_RETRY_DELAY.rateLimit, this.abortController.signal, SteamUpdateCanceledError);
        } else {
          this.logger.warn(
            `[GetAppAchievements] Attempt ${attempt + 1}/${MAX_STEAM_API_RETRIES} failed for appid: ${appid} - ${getErrorNameAndMessage(error)}`
          );

          await sleep(STEAM_API_RETRY_DELAY.error, this.abortController.signal, SteamUpdateCanceledError);
        }
      }
    }

    throw new RetryExhaustedError(`Failed to retrieve achievements for appid ${appid} after ${MAX_STEAM_API_RETRIES} attempts`);
  }
}
