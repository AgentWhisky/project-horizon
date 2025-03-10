import { Controller, Get, Post, UseInterceptors } from '@nestjs/common';
import { AdminDashboardService } from './admin-dashboard.service';
import { RequireRight } from 'src/decorators/require-right.decorator';
import { CacheInterceptor, CacheKey } from '@nestjs/cache-manager';
import { CacheUtils } from 'src/common/utils/cache.utils';
import { CACHE_KEY } from 'src/common/constants/cache-keys.constants';
import { USER_RIGHTS } from 'src/common/constants/user-rights.constants';

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
    return this.adminDashboardService.getDashboard();
  }

  @Post('refresh-creation-code')
  @RequireRight(USER_RIGHTS.VIEW_DASHBOARD)
  async refreshRecord() {
    const creationCodeRefresh = await this.adminDashboardService.refreshCreationCode();
    await this.cacheUtils.clearAdminDashboard();
    return creationCodeRefresh;
  }
}
