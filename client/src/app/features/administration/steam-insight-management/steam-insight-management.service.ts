import { inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { MatSnackBar } from '@angular/material/snack-bar';

import { TokenService } from '@hz/core/services';
import { SteamInsightDashboard } from './steam-insight-management.model';
import { LOADING_STATUS } from '@hz/core/constants';

@Injectable({
  providedIn: 'root',
})
export class SteamInsightManagementService {
  private tokenService = inject(TokenService);
  private snackbar = inject(MatSnackBar);

  private _dashboard = signal<SteamInsightDashboard | null>(null);
  readonly dashboard = this._dashboard.asReadonly();

  private _dashboardLoadingStatus = signal<number>(LOADING_STATUS.NOT_LOADED);
  readonly dashboardLoadingStatus = this._dashboardLoadingStatus.asReadonly();

  constructor() {}

  async loadDashboard() {
    try {
      // Keep status as success to prevent showing loading spinner during updates to dashboard
      if (this._dashboardLoadingStatus() !== LOADING_STATUS.SUCCESS) {
        this._dashboardLoadingStatus.set(LOADING_STATUS.IN_PROGRESS);
      }
      const steamInsightDashboard = await this.getDashboard();
      this._dashboard.set(steamInsightDashboard);
      this._dashboardLoadingStatus.set(LOADING_STATUS.SUCCESS);
    } catch (error) {
      this._dashboardLoadingStatus.set(LOADING_STATUS.FAILED);
      console.error(`Error fetching dashboard: ${error}`);
    }
  }

  // PRIVATE FUNCTIONS

  private async getDashboard() {
    const steamStats$ = this.tokenService.getWithTokenRefresh<SteamInsightDashboard>(`/steam-insight-management/dashboard`);
    return firstValueFrom(steamStats$);
  }
}
