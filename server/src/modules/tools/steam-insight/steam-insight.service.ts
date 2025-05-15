import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SteamAppEntity } from 'src/entities/steam-app.entity';
import { Repository } from 'typeorm';
import { SteamAppSummary } from './steam-insight.model';

@Injectable()
export class SteamInsightService {
  constructor(
    @InjectRepository(SteamAppEntity)
    private readonly steamAppRepository: Repository<SteamAppEntity>
  ) {}

  async getSteamGames(): Promise<SteamAppSummary[]> {
    const apps = await this.steamAppRepository.find({
      select: { appid: true, name: true, type: true, headerImage: true, shortDescription: true },
      take: 10,
    });

    return apps;
  }
}
