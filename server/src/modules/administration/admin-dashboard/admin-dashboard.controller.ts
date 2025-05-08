import { Controller, Get, Post, UseInterceptors } from '@nestjs/common';
import { AdminDashboardService } from './admin-dashboard.service';
import { RequireRight } from 'src/common/decorators/require-right.decorator';
import { CacheInterceptor, CacheKey } from '@nestjs/cache-manager';
import { CacheUtils } from 'src/common/utils/cache.utils';
import { CACHE_KEY } from 'src/common/constants/cache-keys.constants';
import { USER_RIGHTS } from 'src/common/constants/user-rights.constants';
import { ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminDashboardResponseDto, CreationCodeRefreshDto } from './dto/admin-dashboard.dto';

@ApiTags('Admin Dashboard')
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
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get Admin Dashboard Data',
    description: 'Retrieves aggregated data for the admin dashboard.',
  })
  @ApiOkResponse({
    description: 'Dashboard data retrieved successfully.',
    type: AdminDashboardResponseDto,
  })
  async getDashboard(): Promise<AdminDashboardResponseDto> {
    return this.adminDashboardService.getDashboard();
  }

  @Post('refresh-creation-code')
  @RequireRight(USER_RIGHTS.VIEW_DASHBOARD)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Refresh Creation Code',
    description: 'Generates a new creation code',
  })
  @ApiCreatedResponse({
    description: 'Successfully refreshed creation code.',
    type: CreationCodeRefreshDto,
  })
  async refreshRecord(): Promise<CreationCodeRefreshDto> {
    const creationCodeRefresh = await this.adminDashboardService.refreshCreationCode();
    await this.cacheUtils.clearAdminDashboard();
    return creationCodeRefresh;
  }
}
