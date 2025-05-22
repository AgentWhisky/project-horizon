import { inject, Injectable, signal } from '@angular/core';
import { TokenService } from '../../../core/services/token.service';
import { firstValueFrom } from 'rxjs';
import { AdminDashboardInfo, CreationCodeRefresh } from './admin-dashboard';
import { MatSnackBar } from '@angular/material/snack-bar';

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
        this.snackbar.open('Successfully refreshed dashboard', 'Close', { duration: 3000 });
      }
    } catch (error) {
      console.error(`Error Fetching Dashboard: ${error}`);
      if (manual) {
        this.snackbar.open('Failed to refresh dashboard', 'Close', { duration: 3000 });
      }
    }
  }

  async refreshCreationCode() {
    try {
      await this.postCreationCodeRefresh();
      await this.loadDashboard();

      this.snackbar.open('Successfully refreshed account creation code', 'Close', { duration: 3000 });
    } catch (error) {
      this.snackbar.open('Failed to refresh account creation code', 'Close', { duration: 3000 });
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
  settings: {
    creationCode: '',
  },
  steamInsight: {
    logs: [],
    totalNewGames: 0,
    totalUpdatedGames: 0,
    totalNewDlc: 0,
    totalUpdatedDlc: 0,
    totalFailures: 0,
    totalGames: 0,
    totalDLC: 0,
    gameLastModified: new Date(),
    dlcLastModified: new Date(),
    maxAppid: 0,
  },
};
