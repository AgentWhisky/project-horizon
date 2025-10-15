import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';

import { USER_RIGHTS } from '@hz/common/constants';
import { RequireRight } from '@hz/common/decorators';
import { SteamInsightUpdateType } from '@hz/common/enums';

import { SteamInsightManagementUpdateService } from './services/steam-insight-management-update.service';
import { SteamInsightManagementService } from './services/steam-insight-management.service';
import { AppActiveStatus, SteamInsightDashboard } from './resources/steam-insight-management.model';
import { SteamInsightUpdatesQueryDto } from './dto/steam-insight-management-updates-query.dto';
import { SteamInsightAppsQueryDto } from './dto/steam-insight-management-apps-query.dto';
import { AppActiveDto } from './dto/steam-insight-management-app-active.dto';

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
  @RequireRight(USER_RIGHTS.MANAGE_STEAM_INSIGHT)
  async getSteamInsightUpdates(@Query() query: SteamInsightUpdatesQueryDto) {
    return this.steamInsightManagementService.getSteamInsightUpdates(query);
  }

  @Get('update/:id')
  @RequireRight(USER_RIGHTS.MANAGE_STEAM_INSIGHT)
  async getSteamInsightUpdate(@Param('id') id: number) {
    return this.steamInsightManagementService.getSteamInsightUpdate(id);
  }

  @Get('apps')
  @RequireRight(USER_RIGHTS.MANAGE_STEAM_INSIGHT)
  async getSteamInsightApps(@Query() query: SteamInsightAppsQueryDto) {
    return this.steamInsightManagementService.getSteamInsightApps(query);
  }

  @Get('app/:appid')
  @RequireRight(USER_RIGHTS.MANAGE_STEAM_INSIGHT)
  async getSteamInsightAppById(@Param('appid') appid: number) {
    return this.steamInsightManagementService.getSteamInsightAppRaw(appid);
  }

  @Put('app/:appid/active')
  @RequireRight(USER_RIGHTS.MANAGE_STEAM_INSIGHT)
  async updateUserActive(@Param('appid', ParseIntPipe) id: number, @Body() body: AppActiveDto): Promise<AppActiveStatus> {
    return this.steamInsightManagementService.updateSteamInsightAppActive(id, body.active);
  }

  /** Steam Insight Update Endpoints */
  @Post('update/start')
  @RequireRight(USER_RIGHTS.MANAGE_STEAM_INSIGHT)
  async postUpdateStart(@Body('type') type?: SteamInsightUpdateType) {
    return this.steamInsightManagementUpdateService.startUpdate(false, type ?? SteamInsightUpdateType.FULL);
  }

  @Post('update/stop')
  @RequireRight(USER_RIGHTS.MANAGE_STEAM_INSIGHT)
  async postUpdateStop() {
    return await this.steamInsightManagementUpdateService.stopUpdate();
  }
}
