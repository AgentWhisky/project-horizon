import { inject, Injectable, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, of, tap } from 'rxjs';

import { TokenService } from '@hz/core/services';
import { HzLoadingState } from '@hz/core/utilities';

import { AppActiveStatus, SteamInsightAppRaw } from '../../resources/steam-insight-management.model';

@Injectable({
  providedIn: 'root',
})
export class AppOverviewService {
  private tokenService = inject(TokenService);

  private readonly _app = signal<SteamInsightAppRaw | null>(null);
  readonly app = this._app.asReadonly();
  readonly loadingState = new HzLoadingState('Steam Insight App', { adminMessage: true });

  loadApp(appid: number) {
    if (this.loadingState.isLoading()) {
      return;
    }

    this.loadingState.setInProgress();

    this.tokenService
      .getWithTokenRefresh<SteamInsightAppRaw>(`/steam-insight-management/app/${appid}`)
      .pipe(
        tap((appRaw: SteamInsightAppRaw) => {
          this._app.set(appRaw);
          this.loadingState.setSuccess();
        }),
        catchError((err: HttpErrorResponse) => {
          this.loadingState.setFailed(err.status);
          console.error(`Failed to fetch Steam Insight App`, { appid, error: err });
          return of(null);
        })
      )
      .subscribe();
  }

  toggleAppActive() {
    const app = this._app();

    if (!app) {
      console.error('No Steam Insight App loaded to toggle active status');
      return;
    }

    this.tokenService
      .putWithTokenRefresh<AppActiveStatus>(`/steam-insight-management/app/${app.appid}/active`, { active: !app.active })
      .pipe(
        tap((activeStatus: AppActiveStatus) => {
          const newApp = { ...this._app()!, active: activeStatus.active };
          this._app.set(newApp);
        }),
        catchError((err: HttpErrorResponse) => {
          console.error(`Failed to update Steam Insight App active status`, { appid: app.appid, error: err });
          return of(null);
        })
      )
      .subscribe();
  }

  reset() {
    this._app.set(null);
    this.loadingState.reset();
  }
}
