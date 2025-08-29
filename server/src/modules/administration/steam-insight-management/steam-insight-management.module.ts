import { Module } from '@nestjs/common';
import { SteamInsightManagementService } from './steam-insight-management.service';
import { SteamInsightManagementController } from './steam-insight-management.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SteamUpdateHistoryEntity } from 'src/entities/steam-update-history.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([SteamUpdateHistoryEntity]), HttpModule],
  controllers: [SteamInsightManagementController],
  providers: [SteamInsightManagementService],
})
export class SteamInsightManagementModule {}
