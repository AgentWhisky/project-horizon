import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';

import { SteamAppEntity } from 'src/entities/steam-app.entity';
import { SteamAppAuditEntity } from 'src/entities/steam-app-audit.entity';
import { SteamUpdateHistoryEntity } from 'src/entities/steam-update-history.entity';

import { SteamInsightManagementController } from './steam-insight-management.controller';
import { SteamInsightManagementService } from './services/steam-insight-management.service';
import { SteamInsightManagementUpdateService } from './services/steam-insight-management-update.service';

@Module({
  imports: [TypeOrmModule.forFeature([SteamAppEntity, SteamAppAuditEntity, SteamUpdateHistoryEntity]), HttpModule],
  controllers: [SteamInsightManagementController],
  providers: [SteamInsightManagementService, SteamInsightManagementUpdateService],
})
export class SteamInsightManagementModule {}
