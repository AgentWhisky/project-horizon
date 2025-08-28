import { Module } from '@nestjs/common';
import { SteamInsightManagementService } from './steam-insight-management.service';
import { SteamInsightManagementController } from './steam-insight-management.controller';

@Module({
  controllers: [SteamInsightManagementController],
  providers: [SteamInsightManagementService],
})
export class SteamInsightManagementModule {}
