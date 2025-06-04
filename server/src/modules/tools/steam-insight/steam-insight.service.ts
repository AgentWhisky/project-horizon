import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SteamAppEntity } from 'src/entities/steam-app.entity';
import { ILike, In, Repository } from 'typeorm';
import { DlcDetails, SteamAppDetails, SteamAppSearchInfo, SteamAppSearchOptions, SteamInitSearchOptions } from './steam-insight.model';
import { STEAM_INSIGHT_PAGE_SIZE } from 'src/common/constants/steam-api.constants';

@Injectable()
export class SteamInsightService {
  constructor(
    @InjectRepository(SteamAppEntity)
    private readonly steamAppRepository: Repository<SteamAppEntity>
  ) {}

  async getSteamGames(options?: SteamAppSearchOptions): Promise<SteamAppSearchInfo> {
    const { page = 0, query, allowAdultContent = false } = options;
    const skip = page * STEAM_INSIGHT_PAGE_SIZE;

    // Setup Keyword Query
    const qb = this.steamAppRepository.createQueryBuilder('app');
    qb.select(['app.appid', 'app.name', 'app.headerImage', 'app.shortDescription', 'app.categories']);
    qb.where('app.type = :type AND app.is_adult = :isAdult', { type: 'game', isAdult: false });
    qb.skip(skip).take(STEAM_INSIGHT_PAGE_SIZE);
    qb.orderBy('app.appid', 'DESC');

    if (query) {
      const keywords = query
        .trim()
        .split(/\s+/)
        .map((word) => word.toLowerCase());

      keywords.forEach((word, index) => {
        qb.andWhere(`LOWER(app.name) ILIKE :kw${index}`, {
          [`kw${index}`]: `%${word}%`,
        });
      });
    }

    const [steamGames, total] = await qb.getManyAndCount();

    return {
      pageLength: total,
      steamGames,
    };
  }

  // UNUSED FOR NOW
  async runSteamGameSearch(options?: SteamInitSearchOptions) {
    const { query, lastAppid, allowAdultContent = false, expiresAt } = options;

    const qb = this.steamAppRepository.createQueryBuilder('app');

    qb.select(['app.appid', 'app.name', 'app.headerImage', 'app.shortDescription', 'app.categories']);
    qb.where('app.type = :type', { type: 'game' });
    qb.orderBy('app.appid', 'DESC');

    // Allow adult content
    if (!allowAdultContent) {
      qb.andWhere('app.is_adult = false');
    }

    // Add keywords to query
    if (query) {
      const keywords = query
        .trim()
        .split(/\s+/)
        .map((keyword) => keyword.toLowerCase());

      keywords.forEach((keyword, index) => {
        qb.andWhere(`LOWER(app.name) LIKE :kw${index}`, {
          [`kw${index}`]: `%${keyword}%`,
        });
      });
    }
  }

  /**
   * Get full steam app details object for a given appid
   * @param appid is the appid for the app to retrieve details for
   * @returns app details or 404 on not found
   */
  async getSteamAppDetails(appid: number): Promise<SteamAppDetails> {
    const appDetails = await this.steamAppRepository.findOne({
      where: { appid },
      select: {
        appid: true,
        name: true,
        lastModified: true,
        type: true,

        // APP INFO
        requiredAge: true,
        isFree: true,
        recommendationsTotal: true,
        comingSoon: true,
        releaseDate: true,
        supportUrl: true,
        supportEmail: true,
        contentDescriptorNotes: true,

        // ARRAYS
        dlc: true,
        packages: true,
        contentDescriptorIds: true,
        developers: true,
        publishers: true,
        categories: true,
        genres: true,

        // TEXT
        detailedDescription: true,
        aboutTheGame: true,
        shortDescription: true,
        supportedLanguages: true,
        reviews: true,
        legalNotice: true,

        // JSON OBJECTS
        screenshots: true,
        movies: true,
        achievements: {
          total: true,
          data: {
            name: true,
            defaultvalue: true,
            displayName: true,
            hidden: true,
            description: true,
            icon: true,
            icongray: true,
          },
        },
        packageGroups: true,
        demos: true,
        fullgame: { appid: true, name: true },

        // URLS & MEDIA
        headerImage: true,
        capsuleImage: true,
        capsuleImagev5: true,
        website: true,
        backgroundUrl: true,
        backgroundRawUrl: true,

        // REQUIREMENTS
        pcMinimum: true,
        pcRecommended: true,
        macMinimum: true,
        macRecommended: true,
        linuxMinimum: true,
        linuxRecommended: true,

        // PLATFORMS
        supportsWindows: true,
        supportsMac: true,
        supportsLinux: true,

        // PRICE
        currency: true,
        initialPrice: true,
        finalPrice: true,
        discountPercent: true,
        initialFormatted: true,
        finalFormatted: true,

        // REVIEWS
        metacriticScore: true,
        metacriticUrl: true,
      },
    });

    if (!appDetails) {
      throw new NotFoundException(`Steam App with appid: ${appid} not found`);
    }

    // Retrieve DLC if it exists
    let dlcDetails: DlcDetails[] = [];
    if (appDetails.dlc) {
      dlcDetails = await this.steamAppRepository.find({
        where: {
          appid: In(appDetails.dlc),
        },
        select: {
          appid: true,
          name: true,
          headerImage: true,
          shortDescription: true,
          releaseDate: true,
        },
        order: { appid: 'DESC' },
      });
    }

    return {
      ...appDetails,
      dlc: dlcDetails,
      achievements: appDetails.achievements ?? { total: 0, data: [] },
      screenshots: appDetails.screenshots ?? [],
      movies: appDetails.movies ?? [],
      categories: appDetails.categories ? [...new Set(appDetails.categories)] : appDetails.categories,
      genres: appDetails.genres ? [...new Set(appDetails.genres)] : appDetails.genres,
    };
  }
}
