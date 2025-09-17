import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';

import { SteamAppEntity } from '@hz/entities/steam-app.entity';
import { SteamAppAuditEntity } from '@hz/entities/steam-app-audit.entity';
import { SteamUpdateHistoryEntity } from '@hz/entities/steam-update-history.entity';
import {
  SteamAppStats,
  SteamInsightDashboard,
  SteamInsightStat,
  SteamInsightUpdate,
  SteamUpdateStats,
} from '../steam-insight-management.model';
import { SteamInsightUpdatesDto } from '../dto/steam-insight-management-update-history.dto';
import { UpdateStatus } from '@hz/common/enums';

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
    const [steamAppStats, steamUpdateHistoryStats, runningUpdate, recentUpdates] = await Promise.all([
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

      this.steamUpdateHistoryRepository.findOne({
        select: { id: true, updateType: true, updateStatus: true, startTime: true, endTime: true },
        where: { updateStatus: UpdateStatus.RUNNING },
        order: { id: 'DESC' },
      }),

      this.steamUpdateHistoryRepository.find({
        select: { id: true, updateType: true, updateStatus: true, startTime: true, endTime: true },
        where: { updateStatus: Not(UpdateStatus.RUNNING) },
        order: { id: 'DESC' },
        take: 10,
      }),
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
      runningUpdate,
      recentUpdates,
    };
  }

  async getSteamInsightUpdates(query: SteamInsightUpdatesDto): Promise<SteamInsightUpdate[]> {
    const { page, pageSize, sortBy, sortOrder, status, type } = query;

    console.log(query);

    const updates = await this.steamUpdateHistoryRepository.find({
      select: {
        id: true,
        updateType: true,
        updateStatus: true,
        startTime: true,
        endTime: true,
        insertsGame: true,
        updatesGame: true,
        noChangeGame: true,
        insertsDlc: true,
        updatesDlc: true,
        noChangeDlc: true,
        notes: true,
        events: true,
      },
      order: { [sortBy]: sortOrder },
      skip: page * pageSize,
      take: pageSize,
    });

    const steamInsightUpdates: SteamInsightUpdate[] = updates.map((update) => ({
      id: update.id,
      updateType: update.updateType,
      updateStatus: update.updateStatus,
      startTime: update.startTime,
      endTime: update.endTime ?? null,
      notes: update.notes,
      events: update.events,
      stats: {
        games: { inserts: update.insertsGame, updates: update.updatesGame, noChange: update.noChangeGame },
        dlc: { inserts: update.insertsDlc, updates: update.updatesDlc, noChange: update.noChangeDlc },
        errors: update.errors,
      },
    }));

    return steamInsightUpdates;
  }
}
