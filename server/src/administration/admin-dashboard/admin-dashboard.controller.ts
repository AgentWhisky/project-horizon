import { Controller, Get, Post } from '@nestjs/common';
import { AdminDashboardService } from './admin-dashboard.service';
import { RequireRight } from 'src/decorators/require-right.decorator';
import { USER_RIGHTS } from 'src/constants';

@Controller('admin-dashboard')
export class AdminDashboardController {
  constructor(private readonly adminDashboardService: AdminDashboardService) {}

  @Get()
  @RequireRight(USER_RIGHTS.VIEW_DASHBOARD)
  async getDashboard() {
    return this.adminDashboardService.getDashboard();
  }

  @Post('refresh-creation-code')
  @RequireRight(USER_RIGHTS.VIEW_DASHBOARD)
  async refreshRecord() {
    return this.adminDashboardService.refreshCreationCode();
  }
}
