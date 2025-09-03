import { ConflictException, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { AppInfoResult, SteamAppAchievements, SteamAppInfo, SteamListApp } from './steam-insight-mangement.model';

import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { RetryExhaustedError } from 'src/common/errors/max-retry.error';
import { delay } from 'src/common/utils/delay.utils';
import {
  SteamApiKeyError,
  SteamApiMaxPageError,
  SteamAppInfoError,
  SteamUpdateCanceledError,
  SteamUpdateDisabledError,
  SteamUpdateInProgressError,
} from 'src/common/errors/steam-api-error';
import { Repository } from 'typeorm';
import { SteamUpdateHistoryEntity } from 'src/entities/steam-update-history.entity';
import {
  MAX_STEAM_API_PAGES,
  MAX_STEAM_API_RETRIES,
  STEAM_API_RETRY_DELAY,
  STEAM_API_URLS,
  UpdateStatus,
  UpdateType,
} from 'src/common/constants/steam-insight.constants';
import { InjectRepository } from '@nestjs/typeorm';
import { generateEventAppend, generateEventMessage } from './steam-insight-management.utils';
import { getErrorNameAndMessage } from 'src/common/utils/error.utils';
import { AppInfoSaveType, SteamAppType } from './steam-insight-management.constants';
import { SteamAppEntity } from 'src/entities/steam-app.entity';
import { SteamAppAuditEntity } from 'src/entities/steam-app-audit.entity';

@Injectable()
export class SteamInsightManagementService implements OnModuleInit {
  private readonly logger = new Logger(SteamInsightManagementService.name);

  private updatePromise: Promise<void> | null = null;
  private isCancelRequested = false;

  constructor(
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
  }

  async startUpdate(isCron?: boolean) {
    if (this.updatePromise) {
      if (isCron) {
        // CRON - Skip error with warning
        this.logger.warn('[Cron] Steam update already in progress, skipping run');
      } else {
        // ENDPOINT - Throw HTTP Error
        throw new ConflictException('Steam Update already in progress');
      }
    }
    this.isCancelRequested = false;

    // Clear updatePromise on completion to track in-progress updates
    this.updatePromise = this.update().finally(() => {
      this.updatePromise = null;
    });
  }

  async stopUpdate() {
    this.isCancelRequested = true;

    if (this.updatePromise) {
      return;
    }

    await this.cleanupHistory();
  }

  private async update(updateType: UpdateType = UpdateType.FULL) {
    let updateId: number | null = null;
    let insertsGame = 0;
    let updatesGame = 0;
    let insertsDlc = 0;
    let updatesDlc = 0;
    let errors = 0;

    try {
      if (process.env.STEAM_UPDATE_ENABLE !== 'true') {
        throw new SteamUpdateDisabledError('Steam updates are disabled by configuration');
      }

      // Create Update History Record
      const updateRecord = this.steamUpdateHistoryRepository.create({
        updateType: UpdateType.FULL,
        updateStatus: UpdateStatus.RUNNING,
        startTime: new Date(),
        events: [generateEventMessage('Steam update started')],
      });

      let updateHistoryRecord: SteamUpdateHistoryEntity;
      try {
        updateHistoryRecord = await this.steamUpdateHistoryRepository.save(updateRecord);
      } catch (error) {
        // Postgres Integrity Constraint Violation - Unique Violation (Only allow one running update)
        if (error?.code === '23505') {
          updateHistoryRecord = await this.steamUpdateHistoryRepository.save({
            updateType: UpdateType.FULL,
            updateStatus: UpdateStatus.FAILED,
            startTime: new Date(),
            endTime: new Date(),
            events: [generateEventMessage('Failed to start update - Another update is in progress')],
            notes: 'Update rejected as another update is in progress',
          });

          throw new SteamUpdateInProgressError('A Steam update is already in progress');
        }
        throw error;
      }

      updateId = updateHistoryRecord.id;
      await this.checkForCancelation();

      let lastCompleteStartTime: Date | null = null;
      if (updateType !== UpdateType.FULL) {
        // Get Most Recent complete update start time
        const lastCompleteRecord = await this.steamUpdateHistoryRepository.findOne({
          where: { updateStatus: UpdateStatus.COMPLETE },
          order: { startTime: 'DESC' },
        });
        lastCompleteStartTime = lastCompleteRecord?.startTime ?? null;
      }
      await this.checkForCancelation();

      // Get steam update list of apps
      const appList = await this.getAppList(lastCompleteStartTime);

      if (lastCompleteStartTime) {
        await this.appendEvent(
          updateId,
          `Retrieved steam app list [${appList.length}] updated after [${lastCompleteStartTime?.toISOString() ?? 'N/A'}]`
        );
      } else {
        await this.appendEvent(updateId, `Retrieved steam app list [${appList.length}]`);
      }

      await this.appendEvent(updateId, `Started updating steam apps`);
      for (const app of appList) {
        await this.checkForCancelation();
        const appid = app.appid;

        try {
          const appInfo = await this.getAppInfo(appid);
          const appAchievements = await this.getAppAchievements(appid);

          const result = await this.saveAppInfo(app, appInfo, appAchievements);

          if (result.appType === SteamAppType.GAME && result.saveType === AppInfoSaveType.INSERT) {
            insertsGame++;
          } else if (result.appType === SteamAppType.GAME && result.saveType === AppInfoSaveType.UPDATE) {
            updatesGame++;
          } else if (result.appType === SteamAppType.DLC && result.saveType === AppInfoSaveType.INSERT) {
            insertsDlc++;
          } else if (result.appType === SteamAppType.DLC && result.saveType === AppInfoSaveType.UPDATE) {
            updatesDlc++;
          }
        } catch (error) {
          // Failures if they exist should be set as validation_failed
          errors++;
        }
      }
      await this.appendEvent(updateId, `Finsihed updating steam apps`);

      // Final cleanup and completion of update
      /**
       * Finalize cleanup
       * - Populate update history with stats
       * - Set to completed status
       */
      await this.steamUpdateHistoryRepository.update(
        {
          id: updateHistoryRecord.id,
        },
        {
          updateStatus: UpdateStatus.COMPLETE,
          endTime: new Date(),
          insertsGame,
          updatesGame,
          insertsDlc,
          updatesDlc,
          errors,
          events: generateEventAppend('Steam update complete'),
        }
      );
    } catch (error) {
      if (error instanceof SteamUpdateCanceledError) {
        await this.steamUpdateHistoryRepository.update(
          {
            id: updateId,
          },
          {
            updateStatus: UpdateStatus.CANCELED,
            endTime: new Date(),
            insertsGame,
            updatesGame,
            insertsDlc,
            updatesDlc,
            errors,
            events: generateEventAppend(getErrorNameAndMessage('Steam update cancelled')),
          }
        );

        return;
      } else if (error instanceof SteamUpdateDisabledError) {
        this.logger.warn('Steam updates are disabled');
      }

      if (updateId) {
        await this.steamUpdateHistoryRepository.update(
          {
            id: updateId,
          },
          {
            updateStatus: UpdateStatus.FAILED,
            endTime: new Date(),
            insertsGame,
            updatesGame,
            insertsDlc,
            updatesDlc,
            errors,
            events: generateEventAppend(getErrorNameAndMessage(error)),
          }
        );
      }
    }
  }

  private async cleanupHistory() {
    /**
     * Clean up DB if there are 'running' updates but server is not tracking any
     * All running statuses are set to canceled
     */
    const runningUpdates = await this.steamUpdateHistoryRepository.find({
      where: { updateStatus: UpdateStatus.RUNNING },
    });

    if (runningUpdates.length > 0) {
      await this.steamUpdateHistoryRepository.update(
        { updateStatus: UpdateStatus.RUNNING },
        { updateStatus: UpdateStatus.CANCELED, endTime: new Date(), notes: 'Update manually canceled' }
      );
    }
  }

  /**
   * Check and handle update cancelation
   * @param updateId The id of the update history record to cancel
   * @returns Nothing if the process is not canceled, throws a SteamUpdateCanceledError on cancelation
   */
  private async checkForCancelation() {
    if (!this.isCancelRequested) {
      return;
    }

    this.isCancelRequested = false;
    throw new SteamUpdateCanceledError('Steam update canceled');
  }

  private async appendEvent(updateId: number, message: string) {
    await this.steamUpdateHistoryRepository.update(
      { id: updateId },
      {
        events: generateEventAppend(message),
      }
    );
  }

  private async saveAppInfo(app: SteamListApp, appInfo: SteamAppInfo, appAchievements: SteamAppAchievements): Promise<AppInfoResult> {
    // Every change to steam_apps table has a coresponding insert to the audit table with a given update history id
    const existing = await this.steamAppRepository.findOneBy({ appid: app.appid });

    return {
      appType: SteamAppType.GAME,
      saveType: !!existing ? AppInfoSaveType.UPDATE : AppInfoSaveType.INSERT,
    };
  }

  private async getAppList(lastModified?: Date, lastAppid?: number): Promise<SteamListApp[]> {
    if (!process.env.STEAM_API_KEY) {
      throw new SteamApiKeyError('Steam API key is missing or invalid');
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
        throw new SteamApiMaxPageError('Exceeded max page count when fetching Steam app list');
      }

      for (let attempt = 0; attempt < MAX_STEAM_API_RETRIES; attempt++) {
        try {
          const response = await firstValueFrom(this.httpService.get(STEAM_API_URLS.LIST, { params }));
          const data = response?.data?.response;
          const apps: SteamListApp[] = data?.apps ?? [];

          appList.push(...apps);

          params.last_appid = data?.last_appid ?? 0;
          hasMoreResults = data?.have_more_results ?? false;

          success = true;
          break;
        } catch (error) {
          const status = error?.response?.status;
          this.logger.warn(`GET AppList attempt ${attempt + 1} failed: ${error.message}`);

          // Steam API Key has been rejected and is either invalidated or expired
          if (status === 403) {
            throw new SteamApiKeyError('Steam API key has been rejected');
          }

          // Retry all other error types
          if (status === 429) {
            await delay(STEAM_API_RETRY_DELAY.RATE_LIMIT);
          } else {
            await delay(STEAM_API_RETRY_DELAY.ERROR);
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
  private async getAppInfo(appid: number): Promise<SteamAppInfo | null> {
    const params = {
      appids: appid,
      cc: 'us',
      l: 'english',
    };

    for (let attempt = 0; attempt < MAX_STEAM_API_RETRIES; attempt++) {
      try {
        const response = await firstValueFrom(this.httpService.get(STEAM_API_URLS.INFO, { params }));
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
        this.logger.warn(`GET AppInfo attempt ${attempt + 1}/${MAX_STEAM_API_RETRIES} failed for appid: ${appid}: `, error.message);

        // Immediately throw a SteamAppInfoError to prevent unnecessary retries
        if (error instanceof SteamAppInfoError) {
          throw error;
        }

        // Retry all other error types
        if (status === 429) {
          await delay(STEAM_API_RETRY_DELAY.RATE_LIMIT);
        } else {
          await delay(STEAM_API_RETRY_DELAY.ERROR);
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
        const response = await firstValueFrom(this.httpService.get(STEAM_API_URLS.SCHEMA, { params }));

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

        this.logger.warn(`GET AppAchievements attempt ${attempt + 1}/${MAX_STEAM_API_RETRIES} failed for appid: ${appid}`, error.message);

        // Immediately throw a SteamAppInfoError to prevent unnecessary retries
        if (status === 403) {
          throw new SteamApiKeyError('Steam API key has been rejected');
        }

        // Retry all other error types
        if (status === 429) {
          await delay(STEAM_API_RETRY_DELAY.RATE_LIMIT);
        } else {
          await delay(STEAM_API_RETRY_DELAY.ERROR);
        }
      }
    }

    throw new RetryExhaustedError(`Failed to retrieve achievements for appid ${appid} after ${MAX_STEAM_API_RETRIES} attempts`);
  }
}
