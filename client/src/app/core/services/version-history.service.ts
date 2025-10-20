import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';

import { catchError, of, tap } from 'rxjs';

import { ASSET_URLS } from '../constants';
import { HzLoadingState } from '../utilities';

import { VersionEntry, VersionEntryRaw } from '../models/version-history.model';

@Injectable({
  providedIn: 'root',
})
export class VersionHistoryService {
  private http = inject(HttpClient);

  private readonly _versionHistory = signal<VersionEntry[]>([]);
  readonly versionHistory = this._versionHistory.asReadonly();

  private readonly _currentVersionInfo = signal<VersionEntry | null>(null);
  readonly currentVersionInfo = this._currentVersionInfo.asReadonly();

  readonly loadingState = new HzLoadingState('Version History');

  loadVersionHistory() {
    if (this.loadingState.isLoading()) {
      return;
    }

    this.loadingState.setInProgress();

    this.http
      .get<VersionEntryRaw[]>(ASSET_URLS.VERSION_HISTORY)
      .pipe(
        tap((versionHistory: VersionEntryRaw[]) => {
          const versionEntries: VersionEntry[] = versionHistory.map((entry) => ({
            version: entry.version,
            date: new Date(entry.date),
            description: entry.description,
          }));

          this._versionHistory.set(versionEntries);

          this.loadingState.setSuccess();
        }),
        catchError((err: HttpErrorResponse) => {
          this.loadingState.setFailed(err.status);
          console.error(`Failed to fetch Horizon version history`);
          return of(null);
        })
      )
      .subscribe();
  }
}
