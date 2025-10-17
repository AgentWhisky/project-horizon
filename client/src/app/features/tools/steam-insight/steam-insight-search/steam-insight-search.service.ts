import { inject, Injectable, signal } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';

import { catchError, debounceTime, distinctUntilChanged, filter, merge, of, startWith, Subject, switchMap, tap } from 'rxjs';

import { MatSnackBar } from '@angular/material/snack-bar';

import { DEBOUNCE_TIME } from '@hz/core/constants';
import { TokenService } from '@hz/core/services';
import { cleanObject, HzLoadingState } from '@hz/core/utilities';

import { SteamAppSearchInfo, SteamGameSummary } from './steam-insight-search.model';

@Injectable({
  providedIn: 'root',
})
export class SteamInsightSearchService {
  private tokenService = inject(TokenService);
  private fb = inject(FormBuilder);

  private readonly _steamGames = signal<SteamGameSummary[]>([]);
  readonly steamGames = this._steamGames.asReadonly();

  private readonly _pageLength = signal<number>(0);
  readonly pageLength = this._pageLength.asReadonly();

  private readonly _pageIndex = signal<number>(0);
  readonly pageIndex = this._pageIndex.asReadonly();

  readonly loadingState = new HzLoadingState('Steam Insight Search');

  readonly searchForm = this.fb.group({
    query: new FormControl<string>(''),
  });

  private refreshTrigger$ = new Subject<void>();

  constructor() {
    merge(
      this.searchForm.get('query')!.valueChanges.pipe(
        debounceTime(DEBOUNCE_TIME.NORMAL),
        distinctUntilChanged(),
        tap(() => this._pageIndex.set(0)) // reset to first page on new query
      ),
      this.refreshTrigger$
    )
      .pipe(
        startWith(''),
        switchMap(() => this.searchGames())
      )
      .subscribe();
  }

  refresh(resetPage = false) {
    if (resetPage) {
      this._pageIndex.set(0);
    }

    this.refreshTrigger$.next();
  }

  setPage(index: number) {
    this._pageIndex.set(index);
    this.refresh();
  }

  searchGames() {
    const query = this.searchForm.get('query')!.value?.trim() || '';
    const page = this._pageIndex();

    this.loadingState.setInProgress();

    const params = new HttpParams({ fromObject: cleanObject({ query, page }) });

    return this.tokenService.getWithTokenRefresh<SteamAppSearchInfo>('/steam-insight', { params }).pipe(
      filter((searchResult) => !!searchResult),
      tap((searchResult) => {
        this._steamGames.set(searchResult.steamGames);
        this._pageLength.set(searchResult.pageLength);
        this.loadingState.setSuccess();
      }),
      catchError((err: HttpErrorResponse) => {
        this.loadingState.setFailed(err.status);
        console.error(`Failed to fetch Steam Insight apps`, { error: err });
        return of(null);
      })
    );
  }

  resetSearch() {
    this.searchForm.reset({ query: '' });
    this._pageIndex.set(0);
    this.refresh();
  }
}
