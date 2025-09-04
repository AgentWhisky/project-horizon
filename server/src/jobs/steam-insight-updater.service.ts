import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom } from 'rxjs';
import { CacheUtils } from 'src/common/utils/cache.utils';
import { SteamAppEntity } from 'src/entities/steam-app.entity';
import { SteamUpdateLogEntity } from 'src/entities/steam-update-log.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SteamInsightUpdaterService implements OnModuleInit {
  private updateInProgress = false;
  private readonly logger = new Logger(SteamInsightUpdaterService.name);

  constructor(
    @InjectRepository(SteamAppEntity)
    private readonly steamAppRepository: Repository<SteamAppEntity>,
    @InjectRepository(SteamUpdateLogEntity)
    private readonly steamUpdateLogRepository: Repository<SteamUpdateLogEntity>,
    private readonly httpService: HttpService,
    private readonly cacheUtils: CacheUtils
  ) {}

  async onModuleInit() {
    if (process.env.STEAM_UPDATE_ENABLE === 'true') {
      this.logger.log('[INITIAL] Updating Steam Apps...');

      try {
        this.updateSteamApps(); // Temporarilly removed await so it will update PROD
        this.logger.log('[INITIAL] Steam App update complete');
      } catch (error) {
        this.logger.error('[INITIAL] Steam app update failed', error.stack || error);
      }
    } else {
      this.logger.warn('[INITIAL] Updating Steam Apps is disabled in server config.');
    }
  }

  @Cron(CronExpression.EVERY_HOUR)
  async updateSteamAppsJob() {
    if (process.env.STEAM_UPDATE_ENABLE === 'true') {
      this.logger.log('[CRON] Updating Steam Apps...');

      try {
        await this.updateSteamApps();
        this.logger.log('[CRON] Steam App update complete');
      } catch (error) {
        this.logger.error('[CRON] Steam app update failed', error.stack || error);
      }
    }
  }

  // *** PRIVATE FUNCTIONS ***
  private async updateSteamApps() {
    /*if (this.updateInProgress) {
      console.log('Steam App Update in Progress.');
      return;
    }

    const updateStartTime = new Date();
    let updateSuccesses: SteamAppEntry[] = [];
    let updateFailures: number[] = [];
    let notes = '';

    try {
      this.updateInProgress = true;

      const result = await this.steamAppRepository.createQueryBuilder('app').select('MAX(app.last_modified)', 'lastModified').getRawOne();

      const lastModified = result?.lastModified;
      if (!lastModified) {
        notes = 'Failed to find most recent update date. Validate connection or data set.';
        throw new Error(notes);
      }

      //const appList = await this.getAppUpdates(lastModified);
      if (!appList) {
        notes = 'Failed to retrieve app list from external API.';
        throw new Error(notes);
      }

      // Update App Info
      for (const app of appList) {
        try {
          //const appInfo = await this.getAppInfo(app.appid);
          //const appAchievements = await this.getAppAchievements(app.appid);

          //const appEntry = await this.saveAppInfo(app, appInfo, appAchievements);

          //updateSuccesses.push(appEntry);
        } catch {
          //updateFailures.push(app.appid);
        }
      }
    } catch (error) {
      if (!notes) {
        notes = `Failed to update steam apps.`;
      }
    } finally {
      const updateEndTime = new Date();

      const successCount = updateSuccesses.length;
      const failureCount = updateFailures.length;

      if (!notes) {
        if (successCount > 0 && failureCount === 0) {
          notes = 'Successfully updated steam apps.';
        } else if (successCount > 0 && failureCount > 0) {
          notes = 'Successfully updated steam apps with failures.';
        } else {
          notes = 'No updates to steam apps.';
        }
      }

      // Create Update Log
      await this.steamUpdateLogRepository.save({
        startTime: updateStartTime,
        endTime: updateEndTime,
        successCount,
        failureCount,
        createdGameCount: updateSuccesses.filter((s) => s.action === 'CREATE' && s.type === 'game').length,
        createdDlcCount: updateSuccesses.filter((s) => s.action === 'CREATE' && s.type === 'dlc').length,
        updatedGameCount: updateSuccesses.filter((s) => s.action === 'UPDATE' && s.type === 'game').length,
        updatedDlcCount: updateSuccesses.filter((s) => s.action === 'UPDATE' && s.type === 'dlc').length,
        successAppIds: updateSuccesses.map((s) => s.appid),
        failureAppIds: updateFailures,
        notes,
      });

      await this.cacheUtils.clearSteamInsightKeys();

      // Run VACUUM to keep index-only scans effective
      await this.steamAppRepository.query(`VACUUM (ANALYZE) steam_apps;`);

      this.updateInProgress = false;
    }*/
  }



  


  private async saveAppInfo(listApp: SteamListApp, appInfo: SteamAppInfo, appAchievements: SteamAppAchievements): Promise<SteamAppEntry> {
    const existing = await this.steamAppRepository.findOneBy({ appid: listApp.appid });

    const entity = this.steamAppRepository.create({
      appid: listApp.appid,
      name: listApp.name,
      lastModified: new Date(listApp.last_modified * 1000),
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
      dlc: appInfo.dlc,
      packages: appInfo.packages,
      contentDescriptorIds: appInfo.content_descriptors?.ids,
      developers: appInfo.developers,
      publishers: appInfo.publishers,
      categories: appInfo.categories?.map((c) => c.description),
      genres: appInfo.genres?.map((g) => g.description),
      detailedDescription: appInfo.detailed_description,
      aboutTheGame: appInfo.about_the_game,
      shortDescription: appInfo.short_description,
      supportedLanguages: appInfo.supported_languages,
      reviews: appInfo.reviews,
      legalNotice: appInfo.legal_notice,
      screenshots: appInfo.screenshots,
      movies: appInfo.movies,
      ratings: appInfo.ratings,
      packageGroups: appInfo.package_groups,
      demos: appInfo.demos,
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
    

    // Check if record needs to move between partitions
    if (existing && existing.isAdult !== entity.isAdult) {
      await this.steamAppRepository.delete({ appid: entity.appid });
    }
    await this.steamAppRepository.save(entity);

    return {
      appid: appInfo.steam_appid,
      type: appInfo.type,
      action: existing ? 'UPDATE' : 'CREATE',
    };
  }
}

function isAdultGame(appInfo: SteamAppInfo): boolean {
  const name = appInfo.name?.toLowerCase() ?? '';
  const about = appInfo.about_the_game?.toLowerCase() ?? '';
  const desc = appInfo.detailed_description?.toLowerCase() ?? '';
  const notes = appInfo.content_descriptors?.notes?.toLowerCase() ?? '';
  const germanyBan = appInfo.ratings?.steam_germany?.banned === '1';
  const descriptorIds = appInfo.content_descriptors?.ids ?? [];

  return (
    germanyBan ||
    /\b(hentai|sex\s?game|sex\s?simulator|nsfw|eroge|porn|lewd|uncensored)\b/.test(name) ||
    [/uncensored adult game/, /explicit sexual content/, /sexually explicit/, /intended for adults only/, /pornographic/].some(
      (regex) => regex.test(about) || regex.test(desc)
    ) ||
    /\b(hentai|pornographic|explicit sexual|adult only|uncensored)\b/.test(notes) ||
    descriptorIds.includes(4)
  );
}

// *** INTERFACES & TYPES ***
interface SteamAppEntry {
  appid: number;
  type: string;
  action: 'CREATE' | 'UPDATE';
}

interface SteamListApp {
  appid: number;
  name: string;
  last_modified: number;
  price_change_number: number;
}

interface SteamAppInfo {
  type: string;
  name: string;
  steam_appid: number;
  required_age: number | string;
  controller_support?: string;
  is_free: boolean;
  dlc?: number[];
  detailed_description: string;
  about_the_game: string;
  short_description: string;
  fullgame?: { appid: number; name: string }[];
  supported_languages: string;
  header_image: string;
  capsule_image?: string;
  capsule_imagev5?: string;
  website?: string;
  background?: string;
  background_raw?: string;
  reviews?: string;
  legal_notice?: string;
  ratings?: any;
  developers?: string[];
  publishers?: string[];
  categories?: { id: number; description: string }[];
  genres?: { id: string; description: string }[];
  screenshots?: Screenshot[];
  movies?: Movie[];
  achievements?: {
    total: number;
    highlighted: { name: string; path: string }[];
  };
  release_date: {
    coming_soon: boolean;
    date: string;
  };
  support_info?: {
    url: string;
    email: string;
  };
  content_descriptors?: {
    ids?: number[];
    notes?: string;
  };
  platforms?: {
    windows: boolean;
    mac: boolean;
    linux: boolean;
  };
  metacritic?: {
    score: number;
    url: string;
  };
  recommendations?: {
    total: number;
  };
  price_overview?: {
    currency: string;
    initial: number;
    final: number;
    discount_percent: number;
    initial_formatted: string;
    final_formatted: string;
  };
  packages?: number[];
  package_groups?: PackageGroup[];
  demos?: { appid: number; description: string }[];
  pc_requirements?: Requirements;
  mac_requirements?: Requirements;
  linux_requirements?: Requirements;
}

interface SteamAppAchievements {
  total: number;
  data: SteamAchievement[];
}

interface SteamAchievement {
  name: string;
  defaultvalue: number;
  displayName: string;
  hidden: number;
  description: string;
  icon: string;
  icongray: string;
}

interface Requirements {
  minimum: string;
  recommended?: string;
}

interface PackageGroup {
  name: string;
  title: string;
  description: string;
  selection_text: string;
  save_text: string;
  display_type: 0 | 1;
  is_recurring_subscription?: string;
  subs: {
    packageid: number;
    percent_savings_text: string;
    percent_savings: number;
    option_text: string;
    option_description: string;
    can_get_free_license?: string;
    is_free_license: boolean;
    price_in_cents_with_discount: number;
  }[];
}

interface Screenshot {
  id: number;
  path_thumbnail: string;
  path_full: string;
}

interface Movie {
  id: number;
  name: string;
  thumbnail: string;
  webm: { '480': string; max: string };
  mp4: { '480': string; max: string };
  highlight: boolean;
}
