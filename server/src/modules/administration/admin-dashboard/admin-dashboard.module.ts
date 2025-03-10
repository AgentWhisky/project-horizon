import { Module } from '@nestjs/common';
import { AdminDashboardService } from './admin-dashboard.service';
import { AdminDashboardController } from './admin-dashboard.controller';
import { SettingEntity } from 'src/entities/settings.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheUtils } from 'src/common/utils/cache.utils';

@Module({
  imports: [TypeOrmModule.forFeature([SettingEntity])],
  controllers: [AdminDashboardController],
  providers: [AdminDashboardService, CacheUtils],
})
export class AdminDashboardModule {}
