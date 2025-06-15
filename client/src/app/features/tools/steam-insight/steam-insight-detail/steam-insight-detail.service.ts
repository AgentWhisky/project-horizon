import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { TokenService } from '../../../../core/services/token.service';
import { SteamInsightHistoryService } from '../steam-insight-history.service';
import { STEAM_INSIGHT_SHOW_ACHIEVEMENTS } from '../../../../core/constants/storage-keys.constant';
import { LOADING_STATUS, emptySteamAppDetails, SteamAppDetails } from './steam-insight-detail';

@Injectable({
  providedIn: 'root',
})
export class SteamInsightDetailService {
  private tokenService = inject(TokenService);

  readonly steamInsightHistoryService = inject(SteamInsightHistoryService);

  private _appDetails = signal<SteamAppDetails>(emptySteamAppDetails);
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

      // Only add games to history
      if (appDetails.type === 'game') {
        this.steamInsightHistoryService.addApp({ appid: appDetails.appid, name: appDetails.name });
      }
    } catch {
      this._loadingStatus.set(LOADING_STATUS.FAILED);
    } finally {
      this._loadingStatus.set(LOADING_STATUS.SUCCESS);
    }
  }

  isLoadSuccessful() {
    return this._loadingStatus() === LOADING_STATUS.SUCCESS;
  }

  isLoadFailure() {
    return this._loadingStatus() === LOADING_STATUS.FAILED;
  }

  resetAppDetails() {
    this._appDetails.set(emptySteamAppDetails);
    this._loadingStatus.set(LOADING_STATUS.NOT_LOADED);
  }

  // *** PRIVATE FUNCTIONS ***
  private async getSteamAppDetails(appid: number) {
    const appDetails$ = this.tokenService.getWithTokenRefresh<SteamAppDetails>(`/steam-insight/${appid}`);
    return firstValueFrom(appDetails$);
  }

  private saveShowHiddenAchievements() {
    localStorage.setItem(STEAM_INSIGHT_SHOW_ACHIEVEMENTS, JSON.stringify(this.showHiddenAchievements()));
  }

  private loadShowHiddenAchievements(): boolean {
    return JSON.parse(localStorage.getItem(STEAM_INSIGHT_SHOW_ACHIEVEMENTS) || 'false');
  }
}
