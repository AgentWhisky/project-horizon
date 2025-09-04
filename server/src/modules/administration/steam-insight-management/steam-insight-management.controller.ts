import { Controller, Post } from '@nestjs/common';

import { USER_RIGHTS } from '@hz/common/constants';
import { RequireRight } from '@hz/common/decorators';

import { SteamInsightManagementUpdateService } from './services/steam-insight-management-update.service';

@Controller('steam-insight-management')
export class SteamInsightManagementController {
  constructor(private readonly steamInsightManagementUpdateService: SteamInsightManagementUpdateService) {}

  /** Steam Insight Update Endpoints */
  @Post('update/start')
  @RequireRight(USER_RIGHTS.MANAGE_STEAM_INSIGHT)
  async postUpdateStart() {
    return await this.steamInsightManagementUpdateService.startUpdate();
  }

  @Post('update/stop')
  @RequireRight(USER_RIGHTS.MANAGE_STEAM_INSIGHT)
  async postUpdateStop() {
    return await this.steamInsightManagementUpdateService.stopUpdate();
  }
}
