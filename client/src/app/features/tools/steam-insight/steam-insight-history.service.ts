import { Injectable, OnDestroy, signal } from '@angular/core';

import { STEAM_INSIGHT_SEARCH, STORAGE_KEYS } from '@hz/core/constants';

import { SteamGameHistoryEntry } from './steam-insight.model';

@Injectable({
  providedIn: 'root',
})
export class SteamInsightHistoryService {
  private readonly _steamGameHistory = signal<SteamGameHistoryEntry[]>(this.loadHistory());
  readonly steamGameHistory = this._steamGameHistory.asReadonly();

  constructor() {
    window.addEventListener('storage', this.handleHistoryUpdate.bind(this));
  }

  addApp(app: SteamGameHistoryEntry) {
    const existingSearch = this._steamGameHistory().filter((item) => item.appid !== app.appid);
    const newHistory = [app, ...existingSearch].slice(0, STEAM_INSIGHT_SEARCH.MAX_HISTORY);

    this._steamGameHistory.set(newHistory);
    this.saveHistory(newHistory);
  }

  removeApp(app: SteamGameHistoryEntry) {
    const newHistory = this._steamGameHistory().filter((item) => item.appid !== app.appid);

    this._steamGameHistory.set(newHistory);
    this.saveHistory(newHistory);
  }

  clearHistory() {
    this.deleteHistory();
    this._steamGameHistory.set([]);
  }

  // *** PRIVATE FUNCTIONS ***
  private saveHistory(history: SteamGameHistoryEntry[]) {
    localStorage.setItem(STORAGE_KEYS.STEAM_INSIGHT.HISTORY, JSON.stringify(history));
  }

  private loadHistory(): SteamGameHistoryEntry[] {
    const historyString = localStorage.getItem(STORAGE_KEYS.STEAM_INSIGHT.HISTORY);

    if (!historyString) {
      return [];
    }

    try {
      return JSON.parse(historyString);
    } catch (error) {
      console.warn('Failed to parse Steam Insight history');
      this.deleteHistory();
      return [];
    }
  }

  private deleteHistory() {
    localStorage.removeItem(STORAGE_KEYS.STEAM_INSIGHT.HISTORY);
  }

  private handleHistoryUpdate(event: StorageEvent) {
    if (event.key === STORAGE_KEYS.STEAM_INSIGHT.HISTORY) {
      const newHistory = event.newValue ? JSON.parse(event.newValue) : [];
      this._steamGameHistory.set(newHistory);
    }
  }
}
