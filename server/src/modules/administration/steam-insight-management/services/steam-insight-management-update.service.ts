import { ConflictException, ForbiddenException, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom } from 'rxjs';
import { Repository } from 'typeorm';
import { CronJob } from 'cron';

import { SteamAppEntity } from '@hz/entities/steam-app.entity';
import { SteamAppAuditEntity, SteamAppChangeType } from '@hz/entities/steam-app-audit.entity';
import { SteamUpdateHistoryEntity } from '@hz/entities/steam-update-history.entity';

import {
  APP_SAVE_TYPE,
  APP_TYPE,
  MAX_STEAM_API_PAGES,
  MAX_STEAM_API_RETRIES,
  POSTGRES_ERRORS,
  STEAM_API_RETRY_DELAY,
  STEAM_API_URLS,
  STEAM_UPDATE_ERRORS,
  STEAM_UPDATE_MESSAGES,
  UpdateStatus,
  UpdateType,
} from '@hz/common/constants';
import {
  SteamUpdateDisabledError,
  SteamUpdateInProgressError,
  SteamUpdateCanceledError,
  SteamApiKeyError,
  SteamApiMaxPageError,
  RetryExhaustedError,
  SteamAppInfoError,
} from '@hz/common/errors';
import { sleep, getErrorNameAndMessage, generateChangeDiff } from '@hz/common/utils';

import { generateEventAppend, generateEventMessage, isAdultGame } from '../steam-insight-management.utils';
import { AppInfoResult, SteamAppAchievements, SteamAppInfo, SteamListApp } from '../steam-insight-management.model';
import { CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { ChangeDiff } from '@hz/common/model';

@Injectable()
export class SteamInsightManagementUpdateService implements OnModuleInit {
  private readonly logger = new Logger(SteamInsightManagementUpdateService.name);

  private updatePromise: Promise<void> | null = null;
  private isCancelRequested = false;

  constructor(
    private readonly httpService: HttpService,
    private schedulerRegistry: SchedulerRegistry,

    @InjectRepository(SteamAppEntity)
    private readonly steamAppRepository: Repository<SteamAppEntity>,

    @InjectRepository(SteamAppAuditEntity)
    private readonly steamAppAuditRepository: Repository<SteamAppAuditEntity>,

    @InjectRepository(SteamUpdateHistoryEntity)
    private readonly steamUpdateHistoryRepository: Repository<SteamUpdateHistoryEntity>
  ) {}

  onModuleInit() {
    this.cleanupHistory();

    if (process.env.STEAM_UPDATE_ENABLE === 'true') {
      const job = new CronJob(CronExpression.EVERY_HOUR, async () => {
        await this.startUpdate(true, UpdateType.INCREMENTAL);
      });

      this.schedulerRegistry.addCronJob('steamInsightUpdateJob', job);
      job.start();

      this.logger.log(`Steam insight updates are enabled on this server and a CRON job will run every hour`);
    } else {
      this.logger.log(`Steam insight updates are disabled on this server`);
    }
  }

  async startUpdate(isCron?: boolean, updateType?: UpdateType) {
    // CRON - Skip error with warning
    // ENDPOINT - Throw HTTP Error

    if (process.env.STEAM_UPDATE_ENABLE !== 'true') {
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
    this.isCancelRequested = false;

    // Clear updatePromise on completion to track in-progress updates
    this.updatePromise = this.update(updateType).finally(() => {
      this.updatePromise = null;
    });

    return { message: STEAM_UPDATE_MESSAGES.updateQueued };
  }

  async stopUpdate() {
    this.isCancelRequested = true;

    // Only cleanup history if the server is not tracking an in-progress update
    if (this.updatePromise) {
      return { message: 'Cancel request received for update in progress' };
    }

    await this.cleanupHistory();

    throw new ConflictException('No update in progress to cancel');
  }

  private async update(updateType: UpdateType = UpdateType.FULL) {
    let updateHistoryId: number | null = null;
    let insertsGame = 0;
    let updatesGame = 0;
    let noChangeGame = 0;
    let insertsDlc = 0;
    let updatesDlc = 0;
    let noChangeDlc = 0;
    let errors = 0;

    try {
      if (process.env.STEAM_UPDATE_ENABLE !== 'true') {
        throw new SteamUpdateDisabledError(STEAM_UPDATE_ERRORS.updatesDisabledError);
      }

      // Create Update History Record
      const updateRecord = this.steamUpdateHistoryRepository.create({
        updateType,
        updateStatus: UpdateStatus.RUNNING,
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
            updateStatus: UpdateStatus.FAILED,
            startTime: new Date(),
            endTime: new Date(),
            events: [generateEventMessage(STEAM_UPDATE_ERRORS.updateInProgressError)],
            notes: STEAM_UPDATE_ERRORS.updateInProgressError,
          });
          await this.steamUpdateHistoryRepository.save(failedRecord);

          throw new SteamUpdateInProgressError(STEAM_UPDATE_ERRORS.updateInProgressError);
        }
        throw error;
      }

      updateHistoryId = updateHistoryRecord.id;
      await this.checkForCancellation();

      let lastCompleteStartTime: Date | null = null;
      if (updateType !== UpdateType.FULL) {
        await this.appendEvent(updateHistoryId, `Retrieving last completed update history record`);
        // Get Most Recent complete update start time
        const lastCompleteRecord = await this.steamUpdateHistoryRepository.findOne({
          where: { updateStatus: UpdateStatus.COMPLETE },
          order: { startTime: 'DESC' },
        });
        lastCompleteStartTime = lastCompleteRecord?.startTime ?? null;
      }
      await this.checkForCancellation();

      if (lastCompleteStartTime) {
        await this.appendEvent(updateHistoryId, `Retrieving apps updated after [${lastCompleteStartTime?.toISOString() ?? 'N/A'}]`);
      } else {
        await this.appendEvent(updateHistoryId, `Retrieving full apps list`);
      }

      // Get steam update list of apps
      const appList = await this.getAppList(lastCompleteStartTime);

      if (lastCompleteStartTime) {
        await this.appendEvent(
          updateHistoryId,
          `Retrieved [${appList.length}] apps to update after [${lastCompleteStartTime?.toISOString() ?? 'N/A'}]`
        );
      } else {
        await this.appendEvent(updateHistoryId, `Retrieved [${appList.length}] apps to update`);
      }

      await this.appendEvent(updateHistoryId, `Started updating steam apps`);
      for (const app of appList) {
        await this.checkForCancellation();
        const appid = app.appid;

        try {
          const appInfo = await this.getAppInfo(appid);
          const appAchievements = await this.getAppAchievements(appid);

          const result = await this.saveAppInfo(app, appInfo, appAchievements, updateHistoryId);

          // Increment counters for each save type
          if (result.appType === APP_TYPE.game && result.saveType === APP_SAVE_TYPE.insert) {
            insertsGame++;
          } else if (result.appType === APP_TYPE.game && result.saveType === APP_SAVE_TYPE.update) {
            updatesGame++;
          } else if (result.appType === APP_TYPE.game && result.saveType === APP_SAVE_TYPE.noChange) {
            noChangeGame++;
          } else if (result.appType === APP_TYPE.dlc && result.saveType === APP_SAVE_TYPE.insert) {
            insertsDlc++;
          } else if (result.appType === APP_TYPE.dlc && result.saveType === APP_SAVE_TYPE.update) {
            updatesDlc++;
          } else if (result.appType === APP_TYPE.dlc && result.saveType === APP_SAVE_TYPE.noChange) {
            noChangeDlc++;
          }
        } catch (error) {
          // Failures if they exist should set app as validation_failed
          try {
            const existing = await this.steamAppRepository.findOneBy({ appid: app.appid });
            if (existing) {
              await this.steamAppRepository.update({ appid: app.appid }, { validationFailed: true });

              await this.steamAppAuditRepository.save({
                appid: app.appid,
                updateHistoryId,
                changeType: SteamAppChangeType.UPDATE,
                changes: {
                  validationFailed: { before: existing.validationFailed, after: true },
                },
                notes: getErrorNameAndMessage(error),
              });
            }
          } catch {}

          errors++;
        }
      }
      await this.appendEvent(updateHistoryId, `Finished updating steam apps`);

      // Final cleanup and completion of update
      await this.steamUpdateHistoryRepository.update(
        {
          id: updateHistoryId,
        },
        {
          updateStatus: UpdateStatus.COMPLETE,
          endTime: new Date(),
          insertsGame,
          updatesGame,
          noChangeGame,
          insertsDlc,
          updatesDlc,
          noChangeDlc,
          errors,
          events: generateEventAppend('Steam insight update complete'),
          notes: STEAM_UPDATE_MESSAGES.updateComplete,
        }
      );
    } catch (error) {
      if (error instanceof SteamUpdateCanceledError) {
        await this.steamUpdateHistoryRepository.update(
          {
            id: updateHistoryId,
          },
          {
            updateStatus: UpdateStatus.CANCELED,
            endTime: new Date(),
            insertsGame,
            updatesGame,
            noChangeGame,
            insertsDlc,
            updatesDlc,
            noChangeDlc,
            errors,
            events: generateEventAppend(STEAM_UPDATE_MESSAGES.updateCanceled),
            notes: STEAM_UPDATE_MESSAGES.updateCanceled,
          }
        );

        return;
      } else if (error instanceof SteamUpdateDisabledError) {
        this.logger.warn(STEAM_UPDATE_ERRORS.updatesDisabledError);
      }

      if (updateHistoryId) {
        await this.steamUpdateHistoryRepository.update(
          {
            id: updateHistoryId,
          },
          {
            updateStatus: UpdateStatus.FAILED,
            endTime: new Date(),
            insertsGame,
            updatesGame,
            noChangeGame,
            insertsDlc,
            updatesDlc,
            noChangeDlc,
            errors,
            events: generateEventAppend(getErrorNameAndMessage(error)),
            notes: getErrorNameAndMessage(error),
          }
        );
      }
    }
  }

  /**
   * Clean up database update history by setting all running updates to canceled
   * if the server is not tracking them
   */
  private async cleanupHistory() {
    const runningUpdates = await this.steamUpdateHistoryRepository.find({
      where: { updateStatus: UpdateStatus.RUNNING },
    });

    if (runningUpdates.length > 0) {
      await this.steamUpdateHistoryRepository.update(
        { updateStatus: UpdateStatus.RUNNING },
        {
          updateStatus: UpdateStatus.CANCELED,
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
    if (!this.isCancelRequested) {
      return;
    }

    this.isCancelRequested = false;
    throw new SteamUpdateCanceledError(STEAM_UPDATE_MESSAGES.updateCanceled);
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
    let hasMoreResults = true;
    let pageCount = 0;
    do {
      let success = false;
      pageCount++;

      if (pageCount > MAX_STEAM_API_PAGES) {
        throw new SteamApiMaxPageError(STEAM_UPDATE_ERRORS.maxPageError);
      }

      for (let attempt = 0; attempt < MAX_STEAM_API_RETRIES; attempt++) {
        try {
          const response = await firstValueFrom(this.httpService.get(STEAM_API_URLS.list, { params }));
          const data = response?.data?.response;
          const apps: SteamListApp[] = data?.apps ?? [];

          appList.push(...apps);

          params.last_appid = data?.last_appid ?? 0;
          hasMoreResults = data?.have_more_results ?? false;

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
            await sleep(STEAM_API_RETRY_DELAY.rateLimit);
          } else {
            await sleep(STEAM_API_RETRY_DELAY.error);
          }
        }
      }

      if (!success) {
        throw new RetryExhaustedError(`Failed to retrieve app list after ${MAX_STEAM_API_RETRIES} attempts`);
      }
    } while (hasMoreResults);

    return appList;
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
      try {
        const response = await firstValueFrom(this.httpService.get(STEAM_API_URLS.info, { params }));
        const result = response?.data?.[String(appid)];

        if (!result?.success) {
          throw new SteamAppInfoError(`Steam app get info failed for appid: ${appid}`, appid);
        }

        const appInfo: SteamAppInfo = response?.data?.[String(appid)]?.data;
        if (!appInfo) {
          throw new SteamAppInfoError(`Steam app info not found for appid: ${appid}`, appid);
        }

        return appInfo ?? null;
      } catch (error) {
        const status = error?.response?.status;

        // Immediately throw a SteamAppInfoError to prevent unnecessary retries
        if (error instanceof SteamAppInfoError) {
          throw error;
        }

        // Retry all other error types
        if (status === 429) {
          this.logger.warn(`GET AppInfo rate limit error: ${getErrorNameAndMessage(error)}`);

          await sleep(STEAM_API_RETRY_DELAY.rateLimit);
        } else {
          this.logger.warn(
            `GET AppInfo attempt ${attempt + 1}/${MAX_STEAM_API_RETRIES} failed for appid: ${appid} - ${getErrorNameAndMessage(error)}`
          );

          await sleep(STEAM_API_RETRY_DELAY.error);
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
      try {
        const response = await firstValueFrom(this.httpService.get(STEAM_API_URLS.schema, { params }));

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
          this.logger.warn(`GET AppAchievements rate limit error: ${getErrorNameAndMessage(error)}`);

          await sleep(STEAM_API_RETRY_DELAY.rateLimit);
        } else {
          this.logger.warn(
            `GET AppAchievements attempt ${attempt + 1}/${MAX_STEAM_API_RETRIES} failed for appid: ${appid} - ${getErrorNameAndMessage(error)}`
          );

          await sleep(STEAM_API_RETRY_DELAY.error);
        }
      }
    }

    throw new RetryExhaustedError(`Failed to retrieve achievements for appid ${appid} after ${MAX_STEAM_API_RETRIES} attempts`);
  }
}
