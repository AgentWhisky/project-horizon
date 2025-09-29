import { Controller, Get, Post } from '@nestjs/common';
import { AdminDashboardService } from './admin-dashboard.service';
import { RequireRight } from 'src/common/decorators/require-right.decorator';
import { USER_RIGHTS } from 'src/common/constants/user-rights.constants';
import { ApiTags } from '@nestjs/swagger';
import { AdminDashboardInfo, CreationCodeResponse } from './admin-dashboard.model';

@ApiTags('Admin Dashboard')
@Controller('admin-dashboard')
export class AdminDashboardController {
  constructor(private readonly adminDashboardService: AdminDashboardService) {}

  @Get()
  @RequireRight(USER_RIGHTS.VIEW_DASHBOARD)
  async getDashboard(): Promise<AdminDashboardInfo> {
    return this.adminDashboardService.getDashboard();
  }

  @Post('refresh-creation-code')
  @RequireRight(USER_RIGHTS.VIEW_DASHBOARD)
  async refreshRecord(): Promise<CreationCodeResponse> {
    return await this.adminDashboardService.refreshCreationCode();
  }
}
