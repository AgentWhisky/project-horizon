import { Controller, Post, Query } from '@nestjs/common';

import { UpdateType, USER_RIGHTS } from '@hz/common/constants';
import { RequireRight } from '@hz/common/decorators';

import { SteamInsightManagementUpdateService } from './services/steam-insight-management-update.service';

@Controller('steam-insight-management')
export class SteamInsightManagementController {
  constructor(private readonly steamInsightManagementUpdateService: SteamInsightManagementUpdateService) {}

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
