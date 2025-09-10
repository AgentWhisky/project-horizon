import { Controller, Get, Post, Query } from '@nestjs/common';

import { UpdateType, USER_RIGHTS } from '@hz/common/constants';
import { RequireRight } from '@hz/common/decorators';

import { SteamInsightManagementUpdateService } from './services/steam-insight-management-update.service';
import { SteamInsightManagementService } from './services/steam-insight-management.service';
import { SteamInsightDashboard } from './steam-insight-management.model';

@Controller('steam-insight-management')
export class SteamInsightManagementController {
  constructor(
    private readonly steamInsightManagementUpdateService: SteamInsightManagementUpdateService,
    private readonly steamInsightManagementService: SteamInsightManagementService
  ) {}

  @Get('dashboard')
  @RequireRight(USER_RIGHTS.MANAGE_STEAM_INSIGHT)
  async getSteamInsightDashboard(): Promise<SteamInsightDashboard> {
    return await this.steamInsightManagementService.getDashboard();
  }

  /** Steam Insight Update Endpoints */
  @Post('update/start')
  //@RequireRight(USER_RIGHTS.MANAGE_STEAM_INSIGHT)
  async postUpdateStart(@Query('type') type?: UpdateType) {
    return await this.steamInsightManagementUpdateService.startUpdate(false, type ?? UpdateType.FULL);
  }

  @Post('update/stop')
  //@RequireRight(USER_RIGHTS.MANAGE_STEAM_INSIGHT)
  async postUpdateStop() {
    return await this.steamInsightManagementUpdateService.stopUpdate();
  }
}
