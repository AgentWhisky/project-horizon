import { effect, inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { TokenService } from '../../../../core/services/token.service';
import { SteamInsightHistoryService } from '../steam-insight-history.service';
import { STEAM_INSIGHT_SHOW_ACHIEVEMENTS } from '../../../../core/constants/storage-keys.constant';
import { emptySteamAppDetails, SteamAppDetails } from './steam-insight-detail';

@Injectable({
  providedIn: 'root',
})
export class SteamInsightDetailService {
  private tokenService = inject(TokenService);

  readonly steamInsightHistoryService = inject(SteamInsightHistoryService);

  private _appDetails = signal<SteamAppDetails>(emptySteamAppDetails);
  readonly appDetails = this._appDetails.asReadonly();

  private _loadingAppDetails = signal<boolean>(false);
  readonly loadingAppDetails = this._loadingAppDetails.asReadonly();

  private _loadingFailed = signal<boolean>(false);
  readonly loadingFailed = this._loadingFailed.asReadonly();

  readonly showHiddenAchievements = signal<boolean>(this.loadShowHiddenAchievements());

  constructor() {
    effect(() => this.saveShowHiddenAchievements());
  }

  async loadSteamAppDetails(appid: number) {
    this._loadingAppDetails.set(true);
    this._loadingFailed.set(false);
    try {
      const appDetails = await this.getSteamAppDetails(appid);
      this._appDetails.set(appDetails);

      // Only add games to history
      if (appDetails.type === 'game') {
        this.steamInsightHistoryService.addApp({ appid: appDetails.appid, name: appDetails.name });
      }
    } catch {
      this._loadingFailed.set(true);
    } finally {
      this._loadingAppDetails.set(false);
    }
  }

  resetAppDetails() {
    this._appDetails.set(emptySteamAppDetails);
    this._loadingAppDetails.set(false);
    this._loadingFailed.set(false);
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
