import { inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { MatSnackBar } from '@angular/material/snack-bar';

import { TokenService } from '@hz/core/services';
import { SNACKBAR_INTERVAL } from '@hz/core/constants';

import { AdminDashboardInfo, CreationCodeRefresh } from './admin-dashboard';

@Injectable({
  providedIn: 'root',
})
export class AdminDashboardService {
  private tokenService = inject(TokenService);
  private snackbar = inject(MatSnackBar);

  private _dashboardInfo = signal<AdminDashboardInfo>(EMPTY_ADMIN_DASHBOARD_INFO);
  readonly dashboardInfo = this._dashboardInfo.asReadonly();

  async loadDashboard(manual: boolean = false) {
    try {
      const dashboard = await this.getDashboard();
      this._dashboardInfo.set(dashboard);
      if (manual) {
        this.snackbar.open('Successfully refreshed dashboard', 'Close', { duration: SNACKBAR_INTERVAL.NORMAL });
      }
    } catch (error) {
      console.error(`Error Fetching Dashboard: ${error}`);
      if (manual) {
        this.snackbar.open('Failed to refresh dashboard', 'Close', { duration: SNACKBAR_INTERVAL.NORMAL });
      }
    }
  }

  async refreshCreationCode() {
    try {
      await this.postCreationCodeRefresh();
      await this.loadDashboard();

      this.snackbar.open('Successfully refreshed account creation code', 'Close', { duration: SNACKBAR_INTERVAL.NORMAL });
    } catch (error) {
      this.snackbar.open('Failed to refresh account creation code', 'Close', { duration: SNACKBAR_INTERVAL.NORMAL });
      console.error(`Error refreshing creation code: ${error}`);
    }
  }

  private async getDashboard() {
    const dashboardInfo$ = this.tokenService.getWithTokenRefresh<AdminDashboardInfo>('/admin-dashboard');
    return firstValueFrom(dashboardInfo$);
  }

  private async postCreationCodeRefresh() {
    const creationCode$ = this.tokenService.postWithTokenRefresh<CreationCodeRefresh>('/admin-dashboard/refresh-creation-code', {});
    return firstValueFrom(creationCode$);
  }
}

const EMPTY_ADMIN_DASHBOARD_INFO: AdminDashboardInfo = {
  creationCode: '',
};
