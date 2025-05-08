import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshTokenEntity } from 'src/entities/refresh-token.entity';
import { RefreshTokenCleanupService } from './refresh-token-cleanup.service';
import { SteamInsightUpdaterService } from './steam-insight-updater.service';
import { SteamAppEntity } from 'src/entities/steam-app.entity';
import { HttpModule } from '@nestjs/axios';
import { SteamUpdateLog } from 'src/entities/steam-update-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RefreshTokenEntity, SteamAppEntity, SteamUpdateLog]), HttpModule],
  providers: [RefreshTokenCleanupService, SteamInsightUpdaterService],
  exports: [RefreshTokenCleanupService, SteamInsightUpdaterService],
})
export class JobsModule {}
