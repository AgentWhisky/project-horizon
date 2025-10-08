import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { And, FindOptionsWhere, ILike, In, Not, Repository } from 'typeorm';

import { SteamAppEntity } from '@hz/entities/steam-app.entity';
import { SteamAppAuditEntity } from '@hz/entities/steam-app-audit.entity';
import { SteamUpdateHistoryEntity } from '@hz/entities/steam-update-history.entity';
import {
  AppActiveStatus,
  SteamAppStats,
  SteamInsightAppRaw,
  SteamInsightAppResponse,
  SteamInsightAppSearchResponse,
  SteamInsightDashboard,
  SteamInsightStat,
  SteamInsightUpdate,
  SteamInsightUpdateSearchResponse,
  SteamInsightUpdateSimple,
  SteamUpdateStats,
} from '../resources/steam-insight-management.model';

import { SteamInsightUpdateStatus } from '@hz/common/enums';
import { parseHzEvent } from '@hz/common/utils';
import { SteamInsightUpdatesQueryDto } from '../dto/steam-insight-management-updates-query.dto';
import { SteamInsightAppsQueryDto } from '../dto/steam-insight-management-apps-query.dto';

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
        where: { updateStatus: SteamInsightUpdateStatus.RUNNING },
        order: { id: 'DESC' },
      }),

      this.steamUpdateHistoryRepository.find({
        select: { id: true, updateType: true, updateStatus: true, startTime: true, endTime: true },
        where: { updateStatus: Not(SteamInsightUpdateStatus.RUNNING) },
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

  async getSteamInsightApps(query: SteamInsightAppsQueryDto): Promise<SteamInsightAppSearchResponse> {
    const { page, pageSize, sortBy, sortOrder, appid, type, keywords, isAdult, validationFailed, active } = query;

    /** Setup base condition boolean and number checks */
    const baseCondition: FindOptionsWhere<SteamAppEntity> = {};

    if (appid) {
      baseCondition.appid = appid;
    }

    if (type) {
      baseCondition.type = type;
    }

    if (isAdult !== undefined) {
      baseCondition.isAdult = isAdult;
    }

    if (validationFailed !== undefined) {
      baseCondition.validationFailed = validationFailed;
    }

    if (active !== undefined) {
      baseCondition.active = active;
    }

    /** Setup ILIKE search on name keywords */
    let where: FindOptionsWhere<SteamAppEntity> | FindOptionsWhere<SteamAppEntity>[] = baseCondition;
    if (keywords) {
      const parts = keywords
        .split(',')
        .map((word) => word.trim())
        .filter((word) => word.length > 0);

      if (parts.length > 0) {
        where = {
          ...baseCondition,
          name: And(...parts.map((word) => ILike(`%${word}%`))),
        };
      }
    }

    const dbApps = await this.steamAppRepository.findAndCount({
      select: {
        appid: true,
        name: true,
        type: true,
        isAdult: true,
        validationFailed: true,
        active: true,
        createdDate: true,
        updatedDate: true,
      },
      where,
      order: { [sortBy]: sortOrder },
      skip: page * pageSize,
      take: pageSize,
    });

    const apps: SteamInsightAppResponse[] = dbApps[0].map((app) => ({
      appid: app.appid,
      name: app.name,
      type: app.type,
      isAdult: app.isAdult,
      validationFailed: app.validationFailed,
      active: app.active,
      createdDate: app.createdDate,
      updatedDate: app.updatedDate,
    }));

    return {
      pageLength: dbApps[1],
      apps,
    };
  }

  /**
   * Get the raw JSON dump for a given Steam Insight app
   * @param appid The appid of the given app
   * @returns A raw JSON dump
   */
  async getSteamInsightAppRaw(appid: number): Promise<SteamInsightAppRaw> {
    const app = await this.steamAppRepository.findOne({ where: { appid } });

    if (!app) {
      throw new NotFoundException(`App with appid [${appid}] not found`);
    }

    const audits = await this.steamAppAuditRepository.find({
      select: {
        id: true,
        appid: true,
        changeType: true,
        changes: {},
        createdDate: true,
      },
      where: { appid },
      order: { id: 'DESC' },
    });

    return {
      ...app,
      appid: app.appid,
      name: app.name,
      type: app.type,
      audits,
    };
  }

  async updateSteamInsightAppActive(appid: number, active: boolean): Promise<AppActiveStatus> {
    const result = await this.steamAppRepository.update({ appid }, { active });

    if (result.affected === 0) {
      throw new NotFoundException(`App with appid [${appid}] not found`);
    }

    return await this.steamAppRepository.findOne({
      select: {
        appid: true,
        active: true,
      },
      where: { appid },
    });
  }

  /** STEAM INSIGHT UPDATES */
  async getSteamInsightUpdates(query: SteamInsightUpdatesQueryDto): Promise<SteamInsightUpdateSearchResponse> {
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

  async getSteamInsightUpdate(id: number): Promise<SteamInsightUpdate> {
    const update = await this.steamUpdateHistoryRepository.findOne({
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
      where: { id },
    });

    if (!update) {
      throw new NotFoundException(`Steam Insight Update with id [${id}] not found`);
    }

    return {
      ...update,
      events: update.events.map(parseHzEvent).reverse(),
    };
  }
}
