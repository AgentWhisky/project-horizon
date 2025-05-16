import { effect, inject, Injectable, signal } from '@angular/core';

import { PageSettings, SteamAppSearchInfo, SteamGameSearchOptions, SteamGameSummary } from './steam-insight-search';
import { firstValueFrom } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TokenService } from '../../../../core/services/token.service';
import { cleanObject } from '../../../../core/utilities/clean-object.util';

@Injectable({
  providedIn: 'root',
})
export class SteamInsightSearchService {
  private tokenService = inject(TokenService);
  private snackbar = inject(MatSnackBar);

  private _steamGames = signal<SteamGameSummary[]>([]);
  readonly steamGames = this._steamGames.asReadonly();

  private _pageSettings = signal<PageSettings>({ pageLength: 0, pageSize: 0 });
  readonly pageSettings = this._pageSettings.asReadonly();

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
