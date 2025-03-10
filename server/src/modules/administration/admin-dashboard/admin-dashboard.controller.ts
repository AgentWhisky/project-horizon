import { Controller, Get, Post, UseInterceptors } from '@nestjs/common';
import { AdminDashboardService } from './admin-dashboard.service';
import { RequireRight } from 'src/decorators/require-right.decorator';
import { CACHE_KEY, USER_RIGHTS } from 'src/common/constants';
import { CacheInterceptor, CacheKey } from '@nestjs/cache-manager';
import { CacheUtils } from 'src/common/utils/cache.utils';

@Controller('admin-dashboard')
@UseInterceptors(CacheInterceptor)
export class AdminDashboardController {
  constructor(
    private readonly adminDashboardService: AdminDashboardService,
    private readonly cacheUtils: CacheUtils
  ) {}

  @Get()
  @RequireRight(USER_RIGHTS.VIEW_DASHBOARD)
  @CacheKey(CACHE_KEY.ADMIN_DASHBOARD)
  async getDashboard() {
    console.log('ADMIN-DASHBOARD: NOT-CACHED');
    return this.adminDashboardService.getDashboard();
  }

  @Post('refresh-creation-code')
  @RequireRight(USER_RIGHTS.VIEW_DASHBOARD)
  async refreshRecord() {
    await this.cacheUtils.clearAdminDashboard();
    return this.adminDashboardService.refreshCreationCode();
  }
}
