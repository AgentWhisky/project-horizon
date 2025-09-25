import { Body, Controller, Get, Post, Query } from '@nestjs/common';

import { ApiParam, ApiTags } from '@nestjs/swagger';

import { USER_RIGHTS } from '@hz/common/constants';
import { RequireRight } from '@hz/common/decorators';
import { UpdateType } from '@hz/common/enums';

import { SteamInsightManagementUpdateService } from './services/steam-insight-management-update.service';
import { SteamInsightManagementService } from './services/steam-insight-management.service';
import { SteamInsightDashboard } from './resources/steam-insight-management.model';
import { SteamInsightUpdatesDto } from './dto/steam-insight-management-update-history.dto';

@ApiTags('Steam Insight Management')
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

  @Get('updates')
  async getSteamInsightUpdates(@Query() query: SteamInsightUpdatesDto) {
    return this.steamInsightManagementService.getSteamInsightUpdates(query);
  }

  /** Steam Insight Update Endpoints */
  @Post('update/start')
  @RequireRight(USER_RIGHTS.MANAGE_STEAM_INSIGHT)
  async postUpdateStart(@Body('type') type?: UpdateType) {
    return this.steamInsightManagementUpdateService.startUpdate(false, type ?? UpdateType.FULL);
  }

  @Post('update/stop')
  @RequireRight(USER_RIGHTS.MANAGE_STEAM_INSIGHT)
  async postUpdateStop() {
    return await this.steamInsightManagementUpdateService.stopUpdate();
  }
}
