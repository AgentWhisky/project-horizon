import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SettingEntity } from 'src/entities/settings.entity';
import { MoreThan, Repository } from 'typeorm';
import { generateCode } from 'src/common/utils/generate-codes.utils';
import { AdminDashboardInfo, CreationCodeRefresh, SettingsInfo, SteamInsightInfo } from './admin-dashboard.model';
import { CREATION_CODE_FIELD, CREATION_CODE_LENGTH } from 'src/common/constants/creation-code.constants';
import { SteamUpdateLogEntity } from 'src/entities/steam-update-log.entity';
import { SteamAppEntity } from 'src/entities/steam-app.entity';

@Injectable()
export class AdminDashboardService {
  constructor(
    @InjectRepository(SettingEntity)
    private readonly settingRepository: Repository<SettingEntity>,
    @InjectRepository(SteamUpdateLogEntity)
    private readonly steamUpdateLogRepository: Repository<SteamUpdateLogEntity>,
    @InjectRepository(SteamAppEntity)
    private readonly steamAppRepository: Repository<SteamAppEntity>
  ) {}

  async getDashboard(): Promise<AdminDashboardInfo> {
    const [settings, steamInsight] = await Promise.all([this.getDashboardSettings(), this.getDashboardSteamInsight()]);

    return {
      settings,
      steamInsight,
    };
  }

  async refreshCreationCode(): Promise<CreationCodeRefresh> {
    const creationCode = generateCode(CREATION_CODE_LENGTH);

    await this.settingRepository.save({
      key: CREATION_CODE_FIELD,
      value: creationCode,
    });

    return { creationCode };
  }

  // *** PRIVATE DASHBOARD SECTION FUNCTIONS ***
  private async getDashboardSettings(): Promise<SettingsInfo> {
    // Get Settings
    const settings = await this.settingRepository.find({
      select: { key: true, value: true },
      where: { key: CREATION_CODE_FIELD },
    });
    const settingsMap = new Map(settings.map((s) => [s.key, s.value]));
    const creationCode = settingsMap.get(CREATION_CODE_FIELD) || '';

    return {
      creationCode,
    };
  }

  private async getDashboardSteamInsight(): Promise<SteamInsightInfo> {
    // Get Steam App Update Logs
    const [recentAppUpdateLogs, dbAppInfo] = await Promise.all([
      this.steamUpdateLogRepository.find({
        where: {
          createdDate: MoreThan(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)), // past 7 days
        },
        order: { createdDate: 'DESC' },
      }),

      this.steamAppRepository
        .createQueryBuilder('app')
        .select([
          `COUNT(*) FILTER (WHERE app.type = 'game') AS "totalGames"`,
          `COUNT(*) FILTER (WHERE app.type = 'dlc') AS "totalDLC"`,
          `MAX(CASE WHEN app.type = 'game' THEN app.last_modified END) AS "gameLastModified"`,
          `MAX(CASE WHEN app.type = 'dlc' THEN app.last_modified END) AS "dlcLastModified"`,
          `MAX(app.appid) AS "maxAppid"`,
        ])
        .getRawOne(),
    ]);

    const steamAppUpdateLogs = recentAppUpdateLogs.map((log) => ({
      id: log.id,
      startTime: log.startTime,
      endTime: log.endTime,
      successCount: log.successCount,
      failureCount: log.failureCount,
      successAppIds: log.successAppIds,
      failureAppIds: log.failureAppIds,
      createdGameCount: log.createdGameCount,
      createdDlcCount: log.createdDlcCount,
      updatedGameCount: log.updatedGameCount,
      updatedDlcCount: log.updatedDlcCount,
      notes: log.notes ?? '',
    }));

    return {
      logs: steamAppUpdateLogs,
      totalNewGames: steamAppUpdateLogs.reduce((sum, cur) => sum + cur.createdGameCount, 0),
      totalUpdatedGames: steamAppUpdateLogs.reduce((sum, cur) => sum + cur.updatedGameCount, 0),
      totalNewDlc: steamAppUpdateLogs.reduce((sum, cur) => sum + cur.createdDlcCount, 0),
      totalUpdatedDlc: steamAppUpdateLogs.reduce((sum, cur) => sum + cur.updatedDlcCount, 0),
      totalFailures: steamAppUpdateLogs.reduce((sum, cur) => sum + cur.failureCount, 0),

      totalGames: dbAppInfo.totalGames,
      totalDLC: dbAppInfo.totalDLC,
      gameLastModified: dbAppInfo.gameLastModified,
      dlcLastModified: dbAppInfo.dlcLastModified,
      maxAppid: dbAppInfo.maxAppid,
    };
  }
}
