import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { VersionEntry, VersionEntryRaw } from '../models/version-history.model';
import { firstValueFrom } from 'rxjs';
import { ASSET_URLS } from '@hz/constants';

@Injectable({
  providedIn: 'root',
})
export class VersionHistoryService {
  private http = inject(HttpClient);

  readonly versionHistory = signal<VersionEntry[]>([]);
  readonly currentVersionInfo = signal<VersionEntry | null>(null);

  async loadVersionHistory() {
    try {
      const versionHistoryRaw = await this.getVersionHistory();

      const versionEntries: VersionEntry[] = versionHistoryRaw.map((entry) => ({
        version: entry.version,
        date: new Date(entry.date),
        description: entry.description,
      }));

      this.versionHistory.set(versionEntries);

      if (versionEntries.length > 0) {
        this.currentVersionInfo.set(versionEntries[0]);
      }
    } catch (error) {
      console.error('Failed to load version history: ', error);
    }
  }

  private async getVersionHistory() {
    const versionHistoryRaw$ = this.http.get<VersionEntryRaw[]>(ASSET_URLS.VERSION_HISTORY);

    return firstValueFrom(versionHistoryRaw$);
  }
}
