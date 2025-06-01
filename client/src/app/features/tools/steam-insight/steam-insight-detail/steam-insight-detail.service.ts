import { effect, inject, Injectable, signal } from '@angular/core';
import { TokenService } from '../../../../core/services/token.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { emptySteamAppDetails, SteamAppDetails } from './steam-insight-detail';
import { firstValueFrom } from 'rxjs';
import { STEAM_INSIGHT_SHOW_ACHIEVEMENTS } from '../../../../core/constants/storage-keys.constant';
import { SteamInsightHistoryService } from '../steam-insight-history.service';

@Injectable({
  providedIn: 'root',
})
export class SteamInsightDetailService {
  private tokenService = inject(TokenService);
  private snackbar = inject(MatSnackBar);

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
    try {
      const appDetails = await this.getSteamAppDetails(appid);
      this._appDetails.set(appDetails);
      this.steamInsightHistoryService.addApp({ appid: appDetails.appid, name: appDetails.name });
    } catch (error: any) {
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
