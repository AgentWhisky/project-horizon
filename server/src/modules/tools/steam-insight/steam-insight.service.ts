import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SteamAppEntity } from 'src/entities/steam-app.entity';
import { ILike, Repository } from 'typeorm';
import { SteamAppDetails, SteamAppSearchInfo, SteamAppSearchOptions } from './steam-insight.model';
import { STEAM_INSIGHT_PAGE_SIZE } from 'src/common/constants/steam-api.constants';

@Injectable()
export class SteamInsightService {
  constructor(
    @InjectRepository(SteamAppEntity)
    private readonly steamAppRepository: Repository<SteamAppEntity>
  ) {}

  async getSteamGames(options?: SteamAppSearchOptions): Promise<SteamAppSearchInfo> {
    const { pageIndex = 0, search, allowAdultContent = false } = options;
    const skip = pageIndex * STEAM_INSIGHT_PAGE_SIZE;

    // Setup Keyword Query
    const qb = this.steamAppRepository.createQueryBuilder('app');
    qb.select(['app.appid', 'app.name', 'app.headerImage', 'app.shortDescription', 'app.categories']);
    qb.where('app.type = :type', { type: 'game' });
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
    };
  }

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
