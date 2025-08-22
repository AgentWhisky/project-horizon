import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { TokenService } from '../../../../core/services/token.service';
import { SteamInsightHistoryService } from '../steam-insight-history.service';
import { SteamAppDetails, EMPTY_STEAM_APP_DETAILS } from './steam-insight-detail';
import { LOADING_STATUS, STORAGE_KEYS } from '@hz/constants';

@Injectable({
  providedIn: 'root',
})
export class SteamInsightDetailService {
  private tokenService = inject(TokenService);

  readonly steamInsightHistoryService = inject(SteamInsightHistoryService);

  private _appDetails = signal<SteamAppDetails>(EMPTY_STEAM_APP_DETAILS);
  readonly appDetails = this._appDetails.asReadonly();

  private _loadingStatus = signal<number>(LOADING_STATUS.NOT_LOADED);
  readonly loadingInProgress = computed(() => this._loadingStatus() === LOADING_STATUS.IN_PROGRESS);
  readonly loadingSuccess = computed(() => this._loadingStatus() === LOADING_STATUS.SUCCESS);
  readonly loadingFailure = computed(() => this._loadingStatus() === LOADING_STATUS.FAILED);

  readonly showHiddenAchievements = signal<boolean>(this.loadShowHiddenAchievements());

  constructor() {
    effect(() => this.saveShowHiddenAchievements());
  }

  async loadSteamAppDetails(appid: number) {
    this._loadingStatus.set(LOADING_STATUS.IN_PROGRESS);
    try {
      const appDetails = await this.getSteamAppDetails(appid);
      this._appDetails.set(appDetails);

      this._loadingStatus.set(LOADING_STATUS.SUCCESS);
      // Only add games to history
      if (appDetails.type === 'game') {
        this.steamInsightHistoryService.addApp({ appid: appDetails.appid, name: appDetails.name });
      }
    } catch {
      this._loadingStatus.set(LOADING_STATUS.FAILED);
    }
  }

  isLoadSuccessful() {
    return this._loadingStatus() === LOADING_STATUS.SUCCESS;
  }

  isLoadFailure() {
    return this._loadingStatus() === LOADING_STATUS.FAILED;
  }

  resetAppDetails() {
    this._appDetails.set(EMPTY_STEAM_APP_DETAILS);
    this._loadingStatus.set(LOADING_STATUS.NOT_LOADED);
  }

  // *** PRIVATE FUNCTIONS ***
  private async getSteamAppDetails(appid: number) {
    const appDetails$ = this.tokenService.getWithTokenRefresh<SteamAppDetails>(`/steam-insight/${appid}`);
    return firstValueFrom(appDetails$);
  }

  private saveShowHiddenAchievements() {
    localStorage.setItem(STORAGE_KEYS.STEAM_INSIGHT.SHOW_ACHIEVEMENTS, JSON.stringify(this.showHiddenAchievements()));
  }

  private loadShowHiddenAchievements(): boolean {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.STEAM_INSIGHT.SHOW_ACHIEVEMENTS) || 'false');
  }
}
