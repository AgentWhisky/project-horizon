import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SteamAppEntity } from '@hz/entities/steam-app.entity';
import { SteamAppAuditEntity } from '@hz/entities/steam-app-audit.entity';
import { SteamUpdateHistoryEntity } from '@hz/entities/steam-update-history.entity';
import { SteamInsightDashboard, SteamInsightStat } from '../steam-insight-management.model';

@Injectable()
export class SteamInsightManagementService {
  private readonly logger = new Logger(SteamInsightManagementService.name);

  constructor(
    @InjectRepository(SteamAppEntity)
    private readonly steamAppRepository: Repository<SteamAppEntity>,

    @InjectRepository(SteamAppAuditEntity)
    private readonly steamAppAuditRepository: Repository<SteamAppAuditEntity>,

    @InjectRepository(SteamUpdateHistoryEntity)
    private readonly steamUpdateHistoryRepository: Repository<SteamUpdateHistoryEntity>
  ) {}

  async getDashboard(): Promise<SteamInsightDashboard> {
    // Get Dashboard Stats
    const [steamAppStats, steamUpdateHistoryStats] = await Promise.all([
      this.steamAppRepository
        .createQueryBuilder('app')
        .select(`COUNT(*) FILTER (WHERE app.type = 'game')`, 'total_games')
        .addSelect(`COUNT(*) FILTER (WHERE app.type = 'dlc')`, 'total_dlc')
        .addSelect('COUNT(*) FILTER (WHERE app.is_adult = true)', 'adult_apps')
        .addSelect('COUNT(*) FILTER (WHERE app.validation_failed = true)', 'total_validation_failed')
        .addSelect('COUNT(*) FILTER (WHERE app.active = false)', 'inactive_apps')
        .addSelect('MAX(app.appid)', 'max_appid')
        .getRawOne<SteamAppStats>(),

      this.steamUpdateHistoryRepository
        .createQueryBuilder('app')
        .select(`COUNT(*) FILTER (WHERE app.update_status = 'C')`, 'complete_updates')
        .addSelect(`COUNT(*) FILTER (WHERE app.update_status = 'X')`, 'canceled_updates')
        .addSelect(`COUNT(*) FILTER (WHERE app.update_status = 'F')`, 'failed_updates')
        .getRawOne<SteamUpdateStats>(),
    ]);

    const appStats: SteamInsightStat[] = [
      { displayName: 'Total Games', value: Number(steamAppStats.total_games) },
      { displayName: 'Total DLC', value: Number(steamAppStats.total_dlc) },
      { displayName: 'Adult Apps', value: Number(steamAppStats.adult_apps) },
      { displayName: 'Validation Failed', value: Number(steamAppStats.total_validation_failed) },
      { displayName: 'Inactive Apps', value: Number(steamAppStats.inactive_apps) },
      { displayName: 'Max AppID', value: Number(steamAppStats.max_appid) },
    ];

    const updateStats: SteamInsightStat[] = [
      { displayName: 'Complete Updates', value: Number(steamUpdateHistoryStats.complete_updates) },
      { displayName: 'Canceled Updates', value: Number(steamUpdateHistoryStats.canceled_updates) },
      { displayName: 'Failed Updates', value: Number(steamUpdateHistoryStats.failed_updates) },
    ];

    return {
      appStats,
      updateStats,
    };
  }
}

interface SteamAppStats {
  total_games: string;
  total_dlc: string;
  adult_apps: string;
  total_validation_failed: string;
  inactive_apps: string;
  max_appid: string;
}

interface SteamUpdateStats {
  complete_updates: string;
  canceled_updates: string;
  failed_updates: string;
}
