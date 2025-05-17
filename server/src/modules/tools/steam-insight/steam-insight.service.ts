import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SteamAppEntity } from 'src/entities/steam-app.entity';
import { ILike, Repository } from 'typeorm';
import { SteamAppDetails, SteamAppSearchInfo, SteamAppSearchOptions } from './steam-insight.model';

@Injectable()
export class SteamInsightService {
  constructor(
    @InjectRepository(SteamAppEntity)
    private readonly steamAppRepository: Repository<SteamAppEntity>
  ) {}

  async getSteamGames(options?: SteamAppSearchOptions): Promise<SteamAppSearchInfo> {
    const { pageIndex = 0, pageSize = 20, search, allowAdultContent = false } = options;
    const skip = pageIndex * pageSize;

    // Setup Keyword Query
    const qb = this.steamAppRepository.createQueryBuilder('app');
    qb.select(['app.appid', 'app.name', 'app.headerImage', 'app.shortDescription', 'app.categories']);
    qb.where('app.type = :type', { type: 'game' });
    qb.skip(skip).take(pageSize);

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
      pageSize,
      steamGames,
    };
  }

  async getSteamAppDetails(appid: number): Promise<SteamAppDetails> {
    const appDetailsDB = await this.steamAppRepository.findOne({ where: { appid } });

    if (!appDetailsDB) {
      throw new NotFoundException(`Steam App with appid: ${appid} not found`);
    }

    const { createdDate, updatedDate, ...appDetails } = appDetailsDB;
    return appDetails;
  }
}
