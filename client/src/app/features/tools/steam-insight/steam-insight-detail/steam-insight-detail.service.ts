import { effect, inject, Injectable, signal } from '@angular/core';
import { TokenService } from '../../../../core/services/token.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { emptySteamAppDetails, SteamAppDetails } from './steam-insight-detail';
import { firstValueFrom } from 'rxjs';
import { STEAM_INSIGHT_SHOW_ACHIEVEMENTS } from '../../../../core/constants/storage-keys.constant';

@Injectable({
  providedIn: 'root',
})
export class SteamInsightDetailService {
  private tokenService = inject(TokenService);
  private snackbar = inject(MatSnackBar);

  private _appDetails = signal<SteamAppDetails>(emptySteamAppDetails);
  readonly appDetails = this._appDetails.asReadonly();

  readonly showHiddenAchievements = signal<boolean>(this.loadShowHiddenAchievements());

  constructor() {
    effect(() => this.saveShowHiddenAchievements());
  }

  async loadSteamAppDetails(appid: number) {
    try {
      const appDetails = await this.getSteamAppDetails(appid);
      this._appDetails.set(appDetails);
    } catch (error) {
      console.error(`Error Fetching Steam App Details: ${error}`);
      this.snackbar.open('Failed to load Steam App details.', 'Close', { duration: 3000 });
    }
  }

  private async getSteamAppDetails(appid: number) {
    const appDetails$ = this.tokenService.getWithTokenRefresh<SteamAppDetails>(`/steam-insight/${appid}`);
    return firstValueFrom(appDetails$);
  }

  saveShowHiddenAchievements() {
    localStorage.setItem(STEAM_INSIGHT_SHOW_ACHIEVEMENTS, JSON.stringify(this.showHiddenAchievements()));
  }

  loadShowHiddenAchievements(): boolean {
    return JSON.parse(localStorage.getItem(STEAM_INSIGHT_SHOW_ACHIEVEMENTS) || 'false');
  }
}
