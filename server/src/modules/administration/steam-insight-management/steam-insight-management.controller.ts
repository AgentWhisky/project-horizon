import { Controller, Get } from '@nestjs/common';
import { SteamInsightManagementService } from './steam-insight-management.service';

@Controller('steam-insight-management')
export class SteamInsightManagementController {
  constructor(private readonly steamInsightManagementService: SteamInsightManagementService) {}

  @Get('test')
  async getLinks() {
    console.log('steam-insight-management/test');
    return await this.steamInsightManagementService.startUpdate();
  }
}
