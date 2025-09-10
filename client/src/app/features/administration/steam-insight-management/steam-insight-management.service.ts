import { inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { MatSnackBar } from '@angular/material/snack-bar';

import { TokenService } from '@hz/core/services';
import { SteamInsightDashboard } from './steam-insight-management.model';

@Injectable({
  providedIn: 'root',
})
export class SteamInsightManagementService {
  private tokenService = inject(TokenService);
  private snackbar = inject(MatSnackBar);

  private _dashboard = signal<SteamInsightDashboard | null>(null);
  readonly dashboard = this._dashboard.asReadonly();

  constructor() {}

  async loadDashboard() {
    try {
      const steamInsightDashboard = await this.getDashboard();
      this._dashboard.set(steamInsightDashboard);
    } catch (error) {
      console.error(`Error fetching dashboard: ${error}`);
    }
  }

  // PRIVATE FUNCTIONS

  private async getDashboard() {
    const steamStats$ = this.tokenService.getWithTokenRefresh<SteamInsightDashboard>(`/steam-insight-management/dashboard`);
    return firstValueFrom(steamStats$);
  }
}
