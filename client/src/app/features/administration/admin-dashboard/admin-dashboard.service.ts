import { inject, Injectable, signal } from '@angular/core';
import { catchError, of, tap } from 'rxjs';

import { MatSnackBar } from '@angular/material/snack-bar';

import { TokenService } from '@hz/core/services';
import { SNACKBAR_INTERVAL } from '@hz/core/constants';

import { AdminDashboardInfo, CreationCodeRefresh } from './resources/admin-dashboard.model';
import { HzLoadingState } from '@hz/core/utilities';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AdminDashboardService {
  private tokenService = inject(TokenService);
  private snackbar = inject(MatSnackBar);

  private _dashboardInfo = signal<AdminDashboardInfo | null>(null);
  readonly dashboardInfo = this._dashboardInfo.asReadonly();

  readonly loadingState = new HzLoadingState('Horizon Admin Dashbboard', { adminMessage: true });

  loadDashboard() {
    if (this.loadingState.isLoading()) {
      return;
    }

    this.loadingState.setInProgress();

    this.tokenService
      .getWithTokenRefresh<AdminDashboardInfo>('/admin-dashboard')
      .pipe(
        tap((dashboard: AdminDashboardInfo) => {
          this._dashboardInfo.set(dashboard);
          this.loadingState.setSuccess();
        }),
        catchError((err: HttpErrorResponse) => {
          this.loadingState.setFailed(err.status);
          console.error(`Failed to fetch Horizon Dashboard`, { error: err });
          return of(null);
        })
      )
      .subscribe();
  }

  reset() {
    this._dashboardInfo.set(null);
    this.loadingState.reset();
  }

  refreshCreationCode() {
    this.tokenService
      .postWithTokenRefresh<CreationCodeRefresh>('/admin-dashboard/refresh-creation-code', {})
      .pipe(
        tap(() => {
          this.loadDashboard();
          this.snackbar.open('Successfully refreshed account creation code', 'Close', { duration: SNACKBAR_INTERVAL.NORMAL });
        }),
        catchError((err: HttpErrorResponse) => {
          this.loadingState.setFailed(err.status);
          console.error(`Failed to refresh Creation Code`, { error: err });
          this.snackbar.open('Failed to refresh account creation code', 'Close', { duration: SNACKBAR_INTERVAL.NORMAL });
          return of(null);
        })
      )
      .subscribe();
  }
}
