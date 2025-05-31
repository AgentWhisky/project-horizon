import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SteamAppEntity } from 'src/entities/steam-app.entity';
import { ILike, Repository } from 'typeorm';
import { SteamAppDetails, SteamAppSearchInfo, SteamAppSearchOptions, SteamInitSearchOptions } from './steam-insight.model';
import { STEAM_INSIGHT_PAGE_SIZE } from 'src/common/constants/steam-api.constants';

@Injectable()
export class SteamInsightService {
  constructor(
    @InjectRepository(SteamAppEntity)
    private readonly steamAppRepository: Repository<SteamAppEntity>
  ) {}

  async getSteamGames(options?: SteamAppSearchOptions): Promise<SteamAppSearchInfo> {
    /*
    const { pageIndex = 0, search, allowAdultContent = false } = options;
    const skip = pageIndex * STEAM_INSIGHT_PAGE_SIZE;

    // Setup Keyword Query
    const qb = this.steamAppRepository.createQueryBuilder('app');
    qb.select(['app.appid', 'app.name', 'app.headerImage', 'app.shortDescription', 'app.categories']);
    qb.where('app.type = :type AND app.is_adult = :isAdult', { type: 'game', isAdult: false });
    //qb.where('app.type = :type', { type: 'game' });
    qb.skip(skip).take(STEAM_INSIGHT_PAGE_SIZE);
    qb.orderBy('app.appid', 'DESC');

    if (search) {
      const keywords = search
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
    };*/

    const { pageIndex = 0, search, allowAdultContent = false } = options;
    const skip = pageIndex * STEAM_INSIGHT_PAGE_SIZE;

    const qb = this.steamAppRepository.createQueryBuilder('app');
    qb.select(['app.appid', 'app.name', 'app.headerImage', 'app.shortDescription', 'app.categories']);
    qb.where('app.type = :type AND app.is_adult = :isAdult', { type: 'game', isAdult: false });
    qb.skip(skip).take(STEAM_INSIGHT_PAGE_SIZE);
    qb.orderBy('app.appid', 'DESC');

    if (search) {
      const keywords = search
        .trim()
        .split(/\s+/)
        .map((word) => word.toLowerCase());

      keywords.forEach((word, index) => {
        qb.andWhere(`LOWER(app.name) ILIKE :kw${index}`, {
          [`kw${index}`]: `%${word}%`,
        });
      });
    }

    // Extract SQL and parameters
    const [sql, params] = qb.getQueryAndParameters();

    // Run EXPLAIN ANALYZE using native query
    const result = await this.steamAppRepository.query(`EXPLAIN (ANALYZE, BUFFERS, VERBOSE, FORMAT TEXT) ${sql}`, params);

    console.log(result.join('\n')); // each row is a line of EXPLAIN output

    return {
      pageLength: 0,
      steamGames: [],
    };
  }

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
    const appDetailsDB = await this.steamAppRepository.findOne({ where: { appid } });

    if (!appDetailsDB) {
      throw new NotFoundException(`Steam App with appid: ${appid} not found`);
    }

    const { createdDate, updatedDate, ...appDetails } = appDetailsDB;

    return {
      ...appDetails,
      categories: appDetails.categories ? [...new Set(appDetails.categories)] : appDetails.categories,
      genres: appDetails.genres ? [...new Set(appDetails.genres)] : appDetails.genres,
    };
  }
}
