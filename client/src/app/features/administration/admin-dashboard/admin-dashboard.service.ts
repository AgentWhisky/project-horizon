import { effect, inject, Injectable, signal } from '@angular/core';
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

  private _dashboardInfo = signal<AdminDashboardInfo>({ creationCode: '' });
  readonly dashboardInfo = this._dashboardInfo.asReadonly();

  async loadDashboard() {
    try {
      const dashboard = await this.getDashboard();
      this._dashboardInfo.set(dashboard);
    } catch (error) {
      console.error(`Error Fetching Dashboard: ${error}`);
    }
  }

  async refreshCreationCode() {
    try {
      const creationCodeRefresh = await this.postCreationCodeRefresh();
      this._dashboardInfo.set({
        ...this._dashboardInfo(),
        creationCode: creationCodeRefresh.creationCode,
      });
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
