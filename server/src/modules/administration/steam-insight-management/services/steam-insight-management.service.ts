import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, In, Not, Repository } from 'typeorm';

import { SteamAppEntity } from '@hz/entities/steam-app.entity';
import { SteamAppAuditEntity } from '@hz/entities/steam-app-audit.entity';
import { SteamUpdateHistoryEntity } from '@hz/entities/steam-update-history.entity';
import {
  SteamAppStats,
  SteamInsightDashboard,
  SteamInsightStat,
  SteamInsightUpdate,
  SteamInsightUpdateSearchResponse,
  SteamInsightUpdateSimple,
  SteamUpdateStats,
} from '../resources/steam-insight-management.model';
import { SteamInsightUpdatesDto } from '../dto/steam-insight-management-update-history.dto';
import { UpdateStatus } from '@hz/common/enums';
import { parseHzEvent } from '@hz/common/utils';

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
    const [steamAppStats, steamUpdateHistoryStats, runningUpdateDB, recentUpdatesDB] = await Promise.all([
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
        select: { id: true, updateType: true, updateStatus: true, startTime: true, endTime: true, events: true },
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

    let runningUpdate = undefined;
    if (runningUpdateDB) {
      runningUpdate = {
        ...runningUpdateDB,
        events: runningUpdateDB?.events?.map((event) => parseHzEvent(event)) ?? [],
      };
    }

    const recentUpdates: SteamInsightUpdateSimple[] = recentUpdatesDB.map((update) => ({
      ...update,
      events: update?.events?.map((event) => parseHzEvent(event)) ?? [],
    }));

    return {
      appStats,
      updateStats,
      runningUpdate,
      recentUpdates,
    };
  }

  async getSteamInsightUpdates(query: SteamInsightUpdatesDto): Promise<SteamInsightUpdateSearchResponse> {
    const { page, pageSize, sortBy, sortOrder, status, type } = query;

    const condition: FindOptionsWhere<SteamUpdateHistoryEntity> = {};

    if (status && status.length > 0) {
      condition.updateStatus = In(status);
    }

    if (type) {
      condition.updateType = type;
    }

    const updateRecords = await this.steamUpdateHistoryRepository.findAndCount({
      select: {
        id: true,
        updateType: true,
        updateStatus: true,
        startTime: true,
        endTime: true,
        stats: {
          games: { inserts: true, updates: true, noChange: true },
          dlc: { inserts: true, updates: true, noChange: true },
          errors: true,
          total: true,
        },
        notes: true,
        events: true,
      },
      where: condition,
      order: { [sortBy]: sortOrder },
      skip: page * pageSize,
      take: pageSize,
    });

    const steamInsightUpdates: SteamInsightUpdate[] = updateRecords[0].map((update) => ({
      id: update.id,
      updateType: update.updateType,
      updateStatus: update.updateStatus,
      startTime: update.startTime,
      endTime: update.endTime ?? null,
      notes: update.notes,
      events: update.events.map(parseHzEvent).reverse(),
      stats: update.stats,
    }));

    return {
      pageLength: updateRecords[1],
      updates: steamInsightUpdates,
    };
  }
}
