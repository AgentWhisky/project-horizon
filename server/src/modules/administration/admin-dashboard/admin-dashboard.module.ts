import { Module } from '@nestjs/common';
import { AdminDashboardService } from './admin-dashboard.service';
import { AdminDashboardController } from './admin-dashboard.controller';
import { SettingEntity } from 'src/entities/settings.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheUtils } from 'src/common/utils/cache.utils';
import { SteamUpdateLogEntity } from 'src/entities/steam-update-log.entity';
import { SteamAppEntity } from 'src/entities/steam-app.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SettingEntity, SteamUpdateLogEntity, SteamAppEntity])],
  controllers: [AdminDashboardController],
  providers: [AdminDashboardService, CacheUtils],
})
export class AdminDashboardModule {}
