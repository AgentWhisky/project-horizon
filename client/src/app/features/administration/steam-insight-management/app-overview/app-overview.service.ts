import { inject, Injectable, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, delay, of, tap } from 'rxjs';

import { MIN_LOADING_DURATION } from '@hz/core/constants';
import { TokenService } from '@hz/core/services';
import { HzLoadingState } from '@hz/core/utilities';

import { SteamInsightAppRaw } from '../steam-insight-management-app-view/resources/steam-insight-management-app-view.model';

@Injectable({
  providedIn: 'root',
})
export class AppOverviewService {
  private tokenService = inject(TokenService);

  readonly app = signal<SteamInsightAppRaw | null>(null);
  readonly loadingState = new HzLoadingState('Steam Insight App');

  loadApp(appid: number) {
    this.loadingState.setInProgress();

    this.tokenService
      .getWithTokenRefresh<SteamInsightAppRaw>(`/steam-insight-management/app/${appid}`)
      .pipe(
        delay(MIN_LOADING_DURATION.NORMAL),
        tap((response) => {
          this.app.set(response);
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
}
