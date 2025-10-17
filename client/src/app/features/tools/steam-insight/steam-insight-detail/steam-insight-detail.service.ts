import { effect, inject, Injectable, signal } from '@angular/core';
import { catchError, of, tap } from 'rxjs';

import { STORAGE_KEYS } from '@hz/core/constants';
import { TokenService } from '@hz/core/services';

import { SteamAppDetails } from './steam-insight-detail.model';
import { SteamInsightHistoryService } from '../steam-insight-history.service';
import { HzLoadingState } from '@hz/core/utilities';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class SteamInsightDetailService {
  private tokenService = inject(TokenService);

  readonly steamInsightHistoryService = inject(SteamInsightHistoryService);

  private readonly _appDetails = signal<SteamAppDetails | null>(null);
  readonly appDetails = this._appDetails.asReadonly();

  private readonly _showHiddenAchievements = signal<boolean>(this.loadShowHiddenAchievements());
  readonly showHiddenAchievements = this._showHiddenAchievements.asReadonly();

  readonly loadingState = new HzLoadingState('Steam Insight App Details');

  loadAppDetails(appid: number) {
    if (this.loadingState.isLoading()) {
      return;
    }

    this.loadingState.setInProgress();

    this.tokenService
      .getWithTokenRefresh<SteamAppDetails>(`/steam-insight/${appid}`)
      .pipe(
        tap((appDetails: SteamAppDetails) => {
          this._appDetails.set(appDetails);

          // Add page load to app view history
          if (appDetails.type === 'game') {
            this.steamInsightHistoryService.addApp({ appid: appDetails.appid, name: appDetails.name });
          }

          this.loadingState.setSuccess();
        }),
        catchError((err: HttpErrorResponse) => {
          this.loadingState.setFailed(err.status);
          console.error(`Failed to fetch Steam Insight app details`, { appid, error: err });
          return of(null);
        })
      )
      .subscribe();
  }

  reset() {
    this._appDetails.set(null);
    this.loadingState.reset();
  }

  toggleHiddenAchievements() {
    const showHiddenAchievements = !this._showHiddenAchievements();

    this._showHiddenAchievements.set(showHiddenAchievements);
    this.saveShowHiddenAchievements(showHiddenAchievements);
  }

  // *** PRIVATE FUNCTIONS ***
  private saveShowHiddenAchievements(showHiddenAchievements: boolean) {
    localStorage.setItem(STORAGE_KEYS.STEAM_INSIGHT.SHOW_ACHIEVEMENTS, JSON.stringify(showHiddenAchievements));
  }

  private loadShowHiddenAchievements(): boolean {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.STEAM_INSIGHT.SHOW_ACHIEVEMENTS) || 'false');
  }
}
