import { effect, inject, Injectable, signal } from '@angular/core';

import { SteamAppSearchInfo, SteamGameSearchOptions, SteamGameSummary, SelectedApp } from './steam-insight-search';
import { firstValueFrom } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TokenService } from '../../../../core/services/token.service';
import { cleanObject } from '../../../../core/utilities/clean-object.util';
import { STEAM_INSIGHT_SEARCH_HISTORY } from '../../../../core/constants/storage-keys.constant';
import { MAX_SEARCH_HISTORY } from '../../../../core/constants/steam-insight.constant';

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

  private _isInitalSearch = signal<boolean>(true);

  private _pageIndex = signal<number>(0);
  readonly pageIndex = this._pageIndex.asReadonly();

  private _currentSearch = signal<string>('');
  readonly currentSearch = this._currentSearch.asReadonly();

  private _searchHistory = signal<SelectedApp[]>(this.loadSearchHistory());
  readonly searchHistory = this._searchHistory.asReadonly();

  constructor() {
    effect(() => this.saveSearchHistory());
  }

  setPage(pageIndex: number) {
    this._pageIndex.set(pageIndex);
    this.loadSteamGames();
  }

  resetSearch() {
    this._currentSearch.set('');
    this._pageIndex.set(0);
  }

  async initalLoad() {
    if (this._isInitalSearch()) {
      await this.search('');
      this._isInitalSearch.set(false);
    }
  }

  async search(search: string) {
    const cleanedSearch = search.trim().toLowerCase();

    // Ignore identical search
    if (!this._isInitalSearch() && cleanedSearch === this._currentSearch()) {
      return;
    }

    this._currentSearch.set(cleanedSearch);
    this._pageIndex.set(0);

    this.loadSteamGames();
  }

  async loadSteamGames() {
    const options = {
      search: this._currentSearch(),
      pageIndex: this.pageIndex(),
    };

    try {
      const searchInfo = await this.getSteamGames(options);
      this._steamGames.set(searchInfo.steamGames);
      this._pageLength.set(searchInfo.pageLength);
    } catch (error) {
      console.error(`Error Fetching Steam Games: ${error}`);
      this.snackbar.open('Failed to load Steam apps. Please try again in about a minute.', 'Close', { duration: 3000 });
    }
  }

  // *** SEARCH HISTORY FUNCTIONS ***
  addSelectedApp(app: SelectedApp) {
    const existingSearch = this._searchHistory()
      .filter((item) => item.appid !== app.appid)
      .slice(0, MAX_SEARCH_HISTORY);

    this._searchHistory.set([app, ...existingSearch]);
  }

  removeSelectedApp(app: SelectedApp) {
    const existingSearch = this._searchHistory().filter((item) => item.appid !== app.appid);

    this._searchHistory.set([...existingSearch]);
  }

  clearSearchHistory() {
    this._searchHistory.set([]);
  }

  // *** PRIVATE FUNCTIONS ***
  private async getSteamGames(options?: SteamGameSearchOptions) {
    const params = new HttpParams({ fromObject: cleanObject(options) });

    const games$ = this.tokenService.getWithTokenRefresh<SteamAppSearchInfo>('/steam-insight', { params });
    return firstValueFrom(games$);
  }

  private saveSearchHistory() {
    localStorage.setItem(STEAM_INSIGHT_SEARCH_HISTORY, JSON.stringify(this._searchHistory()));
  }

  private loadSearchHistory(): SelectedApp[] {
    const searchHistoryString = localStorage.getItem(STEAM_INSIGHT_SEARCH_HISTORY);
    return searchHistoryString ? JSON.parse(searchHistoryString) : [];
  }
}
