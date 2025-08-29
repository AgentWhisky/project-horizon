import { Injectable, Logger } from '@nestjs/common';
import { SteamAppAchievements, SteamAppInfo, SteamListApp } from './steam-insight-mangement.model';

import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { RetryExhaustedError } from 'src/common/errors/max-retry.error';
import { delay } from 'src/common/utils/delay.utils';
import {
  SteamApiKeyError,
  SteamApiMaxPageError,
  SteamAppInfoError,
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

@Injectable()
export class SteamInsightManagementService {
  private readonly logger = new Logger(SteamInsightManagementService.name);

  constructor(
    private readonly httpService: HttpService,

    @InjectRepository(SteamUpdateHistoryEntity)
    private readonly steamUpdateHistoryRepository: Repository<SteamUpdateHistoryEntity>
  ) {}

  async startUpdate() {
    // Add Event History to Update History Record
    // Remove Default numbers allow zero to counts

    try {
      if (process.env.STEAM_UPDATE_ENABLE !== 'true') {
        throw new SteamUpdateDisabledError('Steam updates are disabled by configuration');
      }

      console.log('A');

      // Create Update History Record
      const update = this.steamUpdateHistoryRepository.create({
        updateType: UpdateType.FULL,
        updateStatus: UpdateStatus.RUNNING,
        startTime: new Date(),
      });

      let updateHistoryRecord: SteamUpdateHistoryEntity;
      try {
        updateHistoryRecord = await this.steamUpdateHistoryRepository.save(update);
      } catch (error) {
        if (error.code === '23505') {
          // Postgres unique violation
          throw new SteamUpdateInProgressError('A Steam update is already in progress');
        }
        throw error;
      }

      // Get Most Recent complete update start time
      const lastCompleteRecord = await this.steamUpdateHistoryRepository.findOne({
        where: { updateStatus: UpdateStatus.COMPLETE },
        order: { startTime: 'DESC' },
      });
      const lastCompleteStartTime = lastCompleteRecord?.startTime ?? undefined;

      // Get steam update list of apps
      const appList = await this.getAppList(lastCompleteStartTime);

      console.log(lastCompleteStartTime, appList.length);
    } catch (error) {
      console.error(error);
    } finally {
    }

    // Get the full steam update list - Throw error on failure
    /**
     * Enumerate steam app list one at a time
     * - Track inserts, updates, and failures
     * - Failures if they exist should be set as validation_failed
     * - Every change to steam_apps table has a coresponding insert to the audit table with a given update history id
     */
    /**
     * Finalize cleanup
     * - Populate update history with stats
     * - Set to completed status
     */
  }

  async stopUpdate() {
    // Check if server has a running update
    // Check if DB sees a running job
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
          this.logger.warn(`No achievements found for appid ${appid}`);
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
