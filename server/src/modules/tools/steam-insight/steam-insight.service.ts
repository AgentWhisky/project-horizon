import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SteamAppEntity } from 'src/entities/steam-app.entity';
import { ILike, Repository } from 'typeorm';
import { SteamAppSearchInfo, SteamAppSearchOptions } from './steam-insight.model';

@Injectable()
export class SteamInsightService {
  constructor(
    @InjectRepository(SteamAppEntity)
    private readonly steamAppRepository: Repository<SteamAppEntity>
  ) {}

  async getSteamGames(options?: SteamAppSearchOptions): Promise<SteamAppSearchInfo> {
    const { pageIndex = 1, pageSize = 20, search, allowAdultContent = false } = options;
    const skip = pageIndex * pageSize;

    console.log('OPTIONS: ', options);

    const [steamGames, total] = await this.steamAppRepository.findAndCount({
      where: {
        type: 'game',
        ...(search && {
          name: ILike(`%${search}%`),
        }),
      },
      skip,
      take: pageSize,
      select: {
        appid: true,
        name: true,
        headerImage: true,
        shortDescription: true,
        categories: true,
      },
    });

    return {
      pageLength: total,
      pageSize,
      steamGames,
    };
  }
}
