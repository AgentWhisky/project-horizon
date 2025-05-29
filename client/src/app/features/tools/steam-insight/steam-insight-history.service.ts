import { effect, Injectable, signal } from '@angular/core';
import { SteamGameHistoryEntry } from './steam-insight';
import { STEAM_INSIGHT_HISTORY } from '../../../core/constants/storage-keys.constant';
import { MAX_SEARCH_HISTORY } from '../../../core/constants/steam-insight.constant';

@Injectable({
  providedIn: 'root',
})
export class SteamInsightHistoryService {
  private _steamGameHistory = signal<SteamGameHistoryEntry[]>(this.loadHistory());
  readonly steamGameHistory = this._steamGameHistory.asReadonly();

  constructor() {
    window.addEventListener('storage', this.handleHistoryUpdate.bind(this));

    effect(() => console.log('GAME HISTORY', this._steamGameHistory()));
  }

  addApp(app: SteamGameHistoryEntry) {
    const existingSearch = this._steamGameHistory()
      .filter((item) => item.appid !== app.appid)
      .slice(0, MAX_SEARCH_HISTORY - 1);
    const newHistory = [app, ...existingSearch];

    this._steamGameHistory.set(newHistory);
    this.saveHistory(newHistory);
  }

  removeApp(app: SteamGameHistoryEntry) {
    const existingSearch = this._steamGameHistory().filter((item) => item.appid !== app.appid);
    const newHistory = [...existingSearch];

    this._steamGameHistory.set(newHistory);
    this.saveHistory(newHistory);
  }

  clearHistory() {
    localStorage.removeItem(STEAM_INSIGHT_HISTORY);
    this._steamGameHistory.set([]);
  }

  // *** PRIVATE FUNCTIONS ***
  private saveHistory(history: SteamGameHistoryEntry[]) {
    localStorage.setItem(STEAM_INSIGHT_HISTORY, JSON.stringify(history));
  }

  private loadHistory(): SteamGameHistoryEntry[] {
    const historyString = localStorage.getItem(STEAM_INSIGHT_HISTORY);
    return historyString ? JSON.parse(historyString) : [];
  }

  private handleHistoryUpdate(event: StorageEvent) {
    if (event.key === STEAM_INSIGHT_HISTORY) {
      const newHistory = event.newValue ? JSON.parse(event.newValue) : [];
      this._steamGameHistory.set(newHistory);
    }
  }
}
