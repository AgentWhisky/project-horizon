import { Injectable, Logger } from '@nestjs/common';
import { SteamAppInfo, SteamListApp } from './steam-insight-mangement.model';
import { MAX_STEAM_API_RETRIES, STEAM_API_RETRY, STEAM_API_URLS } from 'src/common/constants/steam-api.constants';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { RetryExhaustedError } from 'src/common/errors/max-retry.error';
import { delay } from 'src/common/utils/delay.utils';

@Injectable()
export class SteamInsightManagementService {
  private readonly logger = new Logger(SteamInsightManagementService.name);

  private updateInProgress = false;

  constructor(private readonly httpService: HttpService) {}

  private async runUpdate() {
    // Check if updates are enabled - Throw error if not
    // Check if update is in progress - Throw error if so
    // Get Start Time and create inital update record (Keep the ID)
    // Get the most recent previous update history record start time
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

  private async getAppList(lastModified: Date): Promise<SteamListApp[] | null> {
    const lastModifiedEpoch = lastModified.valueOf() / 1000;

    const params = {
      key: process.env.STEAM_API_KEY,
      max_results: 50000,
      include_games: 'True',
      include_dlc: 'True',
      if_modified_since: lastModifiedEpoch,
    };

    // Throw error that steam key is invalid

    return null;
  }

  /**
   * Get steam app info for a given appid from the Steam API
   * @param appid The given appid for a steam app
   * @returns The retrieved app info or null on failure
   */
  private async getAppInfo(appid: number): Promise<SteamAppInfo | null> {
    const params = {
      appid,
    };

    for (let attempt = 0; attempt < MAX_STEAM_API_RETRIES; attempt++) {
      try {
        const appInfo$ = this.httpService.get(STEAM_API_URLS.INFO, { params });
        const response = await firstValueFrom(appInfo$);
        const result = response?.data?.[String(appid)];

        if (!result?.success) {
          throw new Error(`GET AppInfo failed for appid: ${appid}`);
        }

        const appInfo: SteamAppInfo = response?.data?.[String(appid)]?.data;
        if (!appInfo) {
          throw new Error(`Steam API response missing data for appid: ${appid}`);
        }

        return appInfo ?? null;
      } catch (error) {
        const status = error?.response?.status;

        this.logger.warn(`GET App Info attempt ${attempt} failed for appid: ${appid}: `, error.message);

        if (status === 429) {
          await delay(STEAM_API_RETRY.RATE_LIMIT);
        } else {
          await delay(STEAM_API_RETRY.ERROR);
        }
      }
    }

    throw new RetryExhaustedError(`Failed to retrieve app info after ${MAX_STEAM_API_RETRIES} attempts`);
  }
}
