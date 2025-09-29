import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SteamAppEntity } from 'src/entities/steam-app.entity';
import { In, Repository } from 'typeorm';
import { DlcDetails, SteamAppDetails, SteamAppSearchInfo, SteamAppSearchOptions } from './steam-insight.model';
import { STEAM_INSIGHT_PAGE_SIZE } from 'src/modules/administration/steam-insight-management/resources/steam-insight-management.constants';

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
    qb.where('app.type = :type AND app.is_adult = :isAdult AND app.active = :active', { type: 'game', isAdult: false, active: true });
    qb.skip(skip).take(STEAM_INSIGHT_PAGE_SIZE);
    qb.orderBy('app.appid', 'DESC');

    if (query) {
      const keywords = query
        .trim()
        .split(/\s+/)
        .map((word) => word.toLowerCase());

      keywords.forEach((word, index) => {
        qb.andWhere(`LOWER(app.name) LIKE :kw${index}`, {
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

  /**
   * Get full steam app details object for a given appid
   * @param appid is the appid for the app to retrieve details for
   * @returns app details or 404 on not found
   */
  async getSteamAppDetails(appid: number): Promise<SteamAppDetails> {
    const appDetails = await this.steamAppRepository.findOne({
      where: { appid, active: true },
      select: {
        appid: true,
        name: true,
        lastModified: true,
        type: true,

        // APP INFO
        releaseDate: true,
        supportUrl: true,
        supportEmail: true,

        // ARRAYS
        dlc: true,
        developers: true,
        publishers: true,
        categories: true,
        genres: true,

        // TEXT
        aboutTheGame: true,
        shortDescription: true,
        supportedLanguages: true,
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
        fullgame: { appid: true, name: true },

        // URLS & MEDIA
        headerImage: true,
        website: true,
        backgroundUrl: true,

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
