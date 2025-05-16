import { effect, inject, Injectable, signal } from '@angular/core';
import { TokenService } from '../../../core/services/token.service';
import { PageSettings, SteamAppSearchInfo, SteamGameSearchOptions, SteamGameSummary } from './steam-insight';
import { firstValueFrom } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { cleanObject } from '../../../core/utilities/clean-object.util';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SteamInsightService {
  private tokenService = inject(TokenService);
  private snackbar = inject(MatSnackBar);

  private _steamGames = signal<SteamGameSummary[]>([]);
  readonly steamGames = this._steamGames.asReadonly();

  private _pageSettings = signal<PageSettings>({ pageLength: 0, pageSize: 0 });
  readonly pageSettings = this._pageSettings.asReadonly();

  constructor() {
    effect(() => console.log('STEAM GAMES', this._steamGames()));
  }

  async loadSteamGames(options?: SteamGameSearchOptions) {
    try {
      const searchInfo = await this.getSteamGames(options);
      this._steamGames.set(searchInfo.steamGames);
      this._pageSettings.set({
        pageLength: searchInfo.pageLength,
        pageSize: searchInfo.pageSize,
      });
    } catch (error) {
      console.error(`Error Fetching Steam Games: ${error}`);
      this.snackbar.open('Failed to load Steam apps. Please try again in about a minute.', 'Close', { duration: 3000 });
    }
  }

  // *** PRIVATE FUNCTIONS ***
  private async getSteamGames(options?: SteamGameSearchOptions) {
    const params = new HttpParams({ fromObject: cleanObject(options) });

    const games$ = this.tokenService.getWithTokenRefresh<SteamAppSearchInfo>('/steam-insight', { params });
    return firstValueFrom(games$);
  }
}
