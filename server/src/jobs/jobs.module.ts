import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshTokenEntity } from 'src/entities/refresh-token.entity';
import { RefreshTokenCleanupService } from './refresh-token-cleanup.service';
import { SteamAppEntity } from 'src/entities/steam-app.entity';
import { HttpModule } from '@nestjs/axios';
import { SteamUpdateLogEntity } from 'src/entities/steam-update-log.entity';
import { CacheUtils } from 'src/common/utils/cache.utils';

@Module({
  imports: [TypeOrmModule.forFeature([RefreshTokenEntity])],
  providers: [RefreshTokenCleanupService, CacheUtils],
  exports: [RefreshTokenCleanupService],
})
export class JobsModule {}
