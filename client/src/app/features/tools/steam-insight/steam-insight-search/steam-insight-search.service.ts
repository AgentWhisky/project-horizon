import { computed, inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { HttpParams } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

import { LOADING_STATUS, SNACKBAR_INTERVAL } from '@hz/core/constants';
import { TokenService } from '@hz/core/services';
import { cleanObject } from '@hz/core/utilities';

import { SteamAppSearchInfo, SteamGameSearchOptions, SteamGameSummary } from './steam-insight-search';

@Injectable({
  providedIn: 'root',
})
export class SteamInsightSearchService {
  private tokenService = inject(TokenService);
  private snackbar = inject(MatSnackBar);

  private _steamGames = signal<SteamGameSummary[]>([]);
  readonly steamGames = this._steamGames.asReadonly();

  private _pageLength = signal<number>(0);
  readonly pageLength = this._pageLength.asReadonly();

  private _pageIndex = signal<number>(0);
  readonly pageIndex = this._pageIndex.asReadonly();

  readonly gameSearchInput = signal<string>('');

  private _activeSearchQuery = signal<string>('');
  readonly activeSearchQuery = this._activeSearchQuery.asReadonly();

  private _loadingStatus = signal<number>(LOADING_STATUS.NOT_LOADED);
  readonly loadingNotLoaded = computed(() => this._loadingStatus() === LOADING_STATUS.NOT_LOADED);
  readonly loadingInProgress = computed(() => this._loadingStatus() === LOADING_STATUS.IN_PROGRESS);
  readonly loadingSuccess = computed(() => this._loadingStatus() === LOADING_STATUS.SUCCESS);
  readonly loadingFailure = computed(() => this._loadingStatus() === LOADING_STATUS.FAILED);

  async search() {
    const query = this.gameSearchInput().trim();

    // Ignore duplicate searches
    if (!this.loadingNotLoaded() && query === this.activeSearchQuery()) {
      return;
    }

    this._activeSearchQuery.set(this.gameSearchInput());
    this._pageIndex.set(0);

    await this.loadSteamGames();
  }

  async resetSearch() {
    this.gameSearchInput.set('');
    this._activeSearchQuery.set('');
    this._pageIndex.set(0);

    await this.loadSteamGames();
  }

  async setPage(pageIndex: number) {
    this._pageIndex.set(pageIndex);
    if (this._pageIndex() !== pageIndex) {
    }

    this._pageIndex.set(pageIndex);
    await this.loadSteamGames();
  }

  async loadSteamGames() {
    this._loadingStatus.set(LOADING_STATUS.IN_PROGRESS);

    const options = {
      query: this._activeSearchQuery(),
      page: this.pageIndex(),
    };

    try {
      const searchInfo = await this.getSteamGames(options);
      this._steamGames.set(searchInfo.steamGames);
      this._pageLength.set(searchInfo.pageLength);
      this._loadingStatus.set(LOADING_STATUS.SUCCESS);
    } catch (error) {
      this._loadingStatus.set(LOADING_STATUS.FAILED);
      console.error(`Error Fetching Steam Games: ${error}`);
      this.snackbar.open('Failed to load Steam apps. Please try again in about a minute.', 'Close', { duration: SNACKBAR_INTERVAL.NORMAL });
    }
  }

  // *** PRIVATE FUNCTIONS ***
  private async getSteamGames(options?: SteamGameSearchOptions) {
    const params = new HttpParams({ fromObject: cleanObject(options) });

    const games$ = this.tokenService.getWithTokenRefresh<SteamAppSearchInfo>('/steam-insight', { params });
    return firstValueFrom(games$);
  }
}
