import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CREATION_CODE_FIELD, CREATION_CODE_LENGTH } from '@hz/common/constants';
import { generateCode } from '@hz/common/utils';

import { AdminDashboardInfo, CreationCodeRefresh } from './admin-dashboard.model';
import { SettingEntity } from '@hz/entities/settings.entity';

@Injectable()
export class AdminDashboardService {
  private isSteamInsightUpdateEnabled = false;
  private isSteamInsightUpdateCronEnabled = false;
  private isSteamInsightCancelOnStartupEnabled = false;

  constructor(
    @InjectRepository(SettingEntity)
    private readonly settingRepository: Repository<SettingEntity>
  ) {
    this.isSteamInsightUpdateEnabled = process.env.STEAM_INSIGHT_UPDATE_ENABLE === 'true';
    this.isSteamInsightUpdateCronEnabled = process.env.STEAM_INSIGHT_CRON_ENABLE === 'true';
    this.isSteamInsightCancelOnStartupEnabled = process.env.STEAM_INSIGHT_CANCEL_ON_STARTUP === 'true';
  }

  async getDashboard(): Promise<AdminDashboardInfo> {
    // Get Settings
    const settings = await this.settingRepository.find({
      select: { key: true, value: true },
      where: { key: CREATION_CODE_FIELD },
    });
    const settingsMap = new Map(settings.map((s) => [s.key, s.value]));

    // Extract Settings
    const creationCode = settingsMap.get(CREATION_CODE_FIELD) || '';

    return {
      creationCode,
      steamInsight: {
        updatesEnabled: this.isSteamInsightUpdateEnabled,
        updateCronEnabled: this.isSteamInsightUpdateCronEnabled,
        updateCancelOnStartup: this.isSteamInsightCancelOnStartupEnabled,
      },
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
}
