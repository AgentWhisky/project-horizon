import { Module } from '@nestjs/common';
import { SteamInsightService } from './steam-insight.service';
import { SteamInsightController } from './steam-insight.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { SteamAppEntity } from 'src/entities/steam-app.entity';
import { CacheUtils } from 'src/common/utils/cache.utils';

@Module({
  imports: [TypeOrmModule.forFeature([SteamAppEntity]), CacheModule.register()],
  controllers: [SteamInsightController],
  providers: [SteamInsightService, CacheUtils],
})
export class SteamInsightModule {}
