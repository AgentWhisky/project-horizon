import { inject, Injectable, signal } from '@angular/core';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { FormBuilder, FormControl } from '@angular/forms';

import { catchError, combineLatest, debounceTime, filter, merge, of, skip, startWith, tap } from 'rxjs';

import { TokenService } from '@hz/core/services';
import { DEBOUNCE_TIME, STORAGE_KEYS } from '@hz/core/constants';
import { cleanObject, HzLoadingState } from '@hz/core/utilities';
import { SortOrder } from '@hz/core/enums';

import {
  SteamInsightApp,
  SteamInsightAppSearchResponse,
  SteamInsightAppsQuery,
  SteamInsightDashboard,
  SteamInsightUpdate,
  SteamInsightUpdateSearchResponse,
  SteamInsightUpdatesQuery,
} from './resources/steam-insight-management.model';
import {
  SteamInsightAppField,
  SteamInsightAppType,
  SteamInsightUpdateField,
  SteamInsightUpdateStatus,
  SteamInsightUpdateType,
} from './resources/steam-insight-management.enum';

@Injectable({
  providedIn: 'root',
})
export class SteamInsightManagementService {
  private tokenService = inject(TokenService);
  private fb = inject(FormBuilder);

  readonly currentTabIndex = signal<number>(0);

  /** Dashboard */
  private readonly _dashboard = signal<SteamInsightDashboard | null>(null);
  readonly dashboard = this._dashboard.asReadonly();

  readonly dashboardLoadingState = new HzLoadingState('Steam Insight Management Dashboard', {
    persistSuccess: true,
    adminMessage: true,
  });

  /** App Search */
  private readonly _apps = signal<SteamInsightApp[]>([]);
  readonly apps = this._apps.asReadonly();

  readonly appsLoadingState = new HzLoadingState('Steam Insight Management Apps', {
    persistSuccess: true,
    adminMessage: true,
  });

  private readonly _appsPageLength = signal<number>(0);
  readonly appsPageLength = this._appsPageLength.asReadonly();

  private readonly _appsSortBy = signal<SteamInsightAppField | null>(null);
  readonly appsSortBy = this._appsSortBy.asReadonly();

  private readonly _appsSortOrder = signal<SortOrder | null>(null);
  readonly appsSortOrder = this._appsSortOrder.asReadonly();

  private readonly _appsPage = signal<number>(0);
  readonly appsPage = this._appsPage.asReadonly();

  private readonly _appsPageSize = signal<number>(this.loadAppSearchPageSize());
  readonly appsPageSize = this._appsPageSize.asReadonly();

  readonly appsSearchForm = this.getAppSearchForm();

  /** Update Search */
  private readonly _updates = signal<SteamInsightUpdate[]>([]);
  readonly updates = this._updates.asReadonly();

  readonly updatesLoadingState = new HzLoadingState('Steam Insight Management Updates', {
    persistSuccess: true,
    adminMessage: true,
  });

  private readonly _updatesPageLength = signal<number>(0);
  readonly updatesPageLength = this._updatesPageLength.asReadonly();

  private readonly _updatesSortBy = signal<SteamInsightUpdateField | null>(null);
  readonly updatesSortBy = this._updatesSortBy.asReadonly();

  private readonly _updatesSortOrder = signal<SortOrder | null>(null);
  readonly updatesSortOrder = this._updatesSortOrder.asReadonly();

  private readonly _updatesPage = signal<number>(0);
  readonly updatesPage = this._updatesPage.asReadonly();

  private readonly _updatesPageSize = signal<number>(this.loadUpdateSearchPageSize());
  readonly updatesPageSize = this._updatesPageSize.asReadonly();

  readonly updatesSearchForm = this.getUpdateSearchForm();

  /** GENERAL FUNCTIONS */
  setCurrentTabIndex(index: number = 0) {
    this.currentTabIndex.set(index);
  }

  reset() {
    this.resetDashboard();
    this.resetApps();
    this.resetUpdates();
  }

  /** DASHBOARD FUNCTIONS */
  loadDashboard() {
    if (this.dashboardLoadingState.isLoading()) {
      return;
    }

    this.dashboardLoadingState.setInProgress();

    this.tokenService
      .getWithTokenRefresh<SteamInsightDashboard>(`/steam-insight-management/dashboard`)
      .pipe(
        tap((dashboard: SteamInsightDashboard) => {
          this._dashboard.set(dashboard);
          this.dashboardLoadingState.setSuccess();
        }),
        catchError((err: HttpErrorResponse) => {
          this.dashboardLoadingState.setFailed(err.status);
          console.error(`Failed to fetch Steam Insight Management Dashboard`, { error: err });
          return of(null);
        })
      )
      .subscribe();
  }

  resetDashboard() {
    this._dashboard.set(null);
    this.dashboardLoadingState.reset();
  }

  startUpdate(isFullUpdate?: boolean) {
    const updateType = isFullUpdate ? SteamInsightUpdateType.FULL : SteamInsightUpdateType.INCREMENTAL;

    this.tokenService
      .postWithTokenRefresh('/steam-insight-management/update/start', { type: updateType })
      .pipe(
        tap(() => this.loadDashboard()),
        catchError((err: HttpErrorResponse) => {
          console.error(`Failed to start Steam Insight Management Update`, { error: err });
          return of(null);
        })
      )
      .subscribe();
  }

  stopUpdate() {
    this.tokenService
      .postWithTokenRefresh('/steam-insight-management/update/stop', {})
      .pipe(
        tap(() => this.loadDashboard()),
        catchError((err: HttpErrorResponse) => {
          console.error(`Failed to stop Steam Insight Management Update`, { error: err });
          return of(null);
        })
      )
      .subscribe();
  }

  /** APP SEARCH FUNCTIONS */
  loadApps(query: SteamInsightAppsQuery = {}) {
    if (this.appsLoadingState.isLoading()) {
      return;
    }

    this.appsLoadingState.setInProgress();

    const form = this.appsSearchForm;
    const mergedQuery: SteamInsightAppsQuery = cleanObject({
      ...query,
      page: this.appsPage(),
      pageSize: this.appsPageSize(),
      sortBy: this.appsSortBy() ?? undefined,
      sortOrder: this.appsSortOrder() ?? undefined,
      appid: form.get('appid')?.value ?? undefined,
      keywords: form.get('keywords')?.value ?? undefined,
      type: form.get('type')?.value ?? undefined,
      isAdult: form.get('isAdult')?.value ?? undefined,
      validationFailed: form.get('validationFailed')?.value ?? undefined,
      active: form.get('active')?.value ?? undefined,
    });
    const params = new HttpParams({ fromObject: mergedQuery as Record<string, string> });

    this.tokenService
      .getWithTokenRefresh<SteamInsightAppSearchResponse>(`/steam-insight-management/apps`, {
        params,
      })
      .pipe(
        tap((search: SteamInsightAppSearchResponse) => {
          this._apps.set(search.apps);
          this._appsPageLength.set(search.pageLength);
          this.appsLoadingState.setSuccess();
        }),
        catchError((err: HttpErrorResponse) => {
          this.appsLoadingState.setFailed(err.status);
          console.error(`Failed to fetch Steam Insight Management Apps`, { error: err });
          return of(null);
        })
      )
      .subscribe();
  }

  resetApps() {
    this._apps.set([]);
    this.appsLoadingState.reset();
  }

  setAppSearchSort(sortBy: string, sortOrder: string) {
    const isValidOrder = sortOrder === 'ASC' || sortOrder === 'DESC';

    this._appsSortBy.set(isValidOrder ? (sortBy as SteamInsightAppField) : null);
    this._appsSortOrder.set(isValidOrder ? (sortOrder as SortOrder) : null);
    this._appsPage.set(0);

    this.loadApps();
  }

  setAppSearchPage(page: number, pageSize: number) {
    this._appsPage.set(page);
    this._appsPageSize.set(pageSize);

    this.saveAppSearchPageSize(pageSize);
    this.loadApps();
  }

  resetAppSearchFilters() {
    // Reset form without emiting event to bypass debounced fields. Refresh search instantly.
    this.appsSearchForm.reset({}, { emitEvent: false });
    this.loadApps();
  }

  getAppSearchForm() {
    const appSearchForm = this.fb.group({
      appid: new FormControl<number | null>(null),
      type: new FormControl<SteamInsightAppType | null>(null),
      keywords: new FormControl<string | null>(null),
      isAdult: new FormControl<boolean | null>(null),
      validationFailed: new FormControl<boolean | null>(null),
      active: new FormControl<boolean | null>(null),
    });

    // Form fields to debounce
    const debouncedControls = ['appid', 'keywords'];
    let flag = true;

    // Debounce specific fields
    const debounced$ = merge(...debouncedControls.map((c) => appSearchForm.get(c)!.valueChanges)).pipe(
      tap(() => (flag = false)),
      debounceTime(DEBOUNCE_TIME.NORMAL),
      tap(() => (flag = true)),
      startWith(null)
    );

    // Instantly trigger on non-debounced fields
    const form$ = appSearchForm.valueChanges.pipe(
      startWith(appSearchForm.value),
      filter(() => flag)
    );

    // Combine into one search trigger event
    combineLatest([debounced$, form$])
      .pipe(
        skip(1),
        tap(() => this.loadApps())
      )
      .subscribe();

    return appSearchForm;
  }

  /** UPDATE SEARCH FUNCTIONS */
  loadUpdates(query: SteamInsightUpdatesQuery = {}) {
    if (this.updatesLoadingState.isLoading()) {
      return;
    }

    this.updatesLoadingState.setInProgress();

    const form = this.updatesSearchForm;
    const mergedQuery = cleanObject({
      ...query,
      page: this.updatesPage(),
      pageSize: this.updatesPageSize(),
      sortBy: this.updatesSortBy() ?? undefined,
      sortOrder: this.updatesSortOrder() ?? undefined,
      status: form.get('statuses')?.value ?? undefined,
      type: form.get('type')?.value ?? undefined,
    });
    const params = new HttpParams({ fromObject: mergedQuery as Record<string, string> });

    this.tokenService
      .getWithTokenRefresh<SteamInsightUpdateSearchResponse>(`/steam-insight-management/updates`, {
        params,
      })
      .pipe(
        tap((search: SteamInsightUpdateSearchResponse) => {
          this._updates.set(search.updates);
          this._updatesPageLength.set(search.pageLength);
          this.updatesLoadingState.setSuccess();
        }),
        catchError((err: HttpErrorResponse) => {
          this.updatesLoadingState.setFailed(err.status);
          console.error(`Failed to fetch Steam Insight Management Updates`, { error: err });
          return of(null);
        })
      )
      .subscribe();
  }

  resetUpdates() {
    this._updates.set([]);
    this.updatesLoadingState.reset();
  }

  setUpdateSearchSort(sortBy: string, sortOrder: string) {
    const isValidOrder = sortOrder === 'ASC' || sortOrder === 'DESC';

    this._updatesSortBy.set(isValidOrder ? (sortBy as SteamInsightUpdateField) : null);
    this._updatesSortOrder.set(isValidOrder ? (sortOrder as SortOrder) : null);
    this._updatesPage.set(0);

    this.loadUpdates();
  }

  setUpdateSearchPage(page: number, pageSize: number) {
    this._updatesPage.set(page);
    this._updatesPageSize.set(pageSize);

    this.saveUpdateSearchPageSize(pageSize);
    this.loadUpdates();
  }

  getUpdateSearchForm() {
    const updateSearchForm = this.fb.group({
      statuses: new FormControl<SteamInsightUpdateStatus[]>([]),
      type: new FormControl<SteamInsightUpdateType | null>(null),
    });

    // Run update history search on value changes
    updateSearchForm.valueChanges.pipe(tap(() => this.loadUpdates())).subscribe();

    return updateSearchForm;
  }

  resetUpdateSearchFilters() {
    this.updatesSearchForm.reset();
  }

  /** PRIVATE FUNCTIONS */
  private saveAppSearchPageSize(pageSize: number) {
    localStorage.setItem(STORAGE_KEYS.STEAM_INSIGHT_MANAGEMENT.APP_SEARCH.PAGE_SIZE, JSON.stringify(pageSize));
  }

  private loadAppSearchPageSize(): number {
    const pageSize = localStorage.getItem(STORAGE_KEYS.STEAM_INSIGHT_MANAGEMENT.APP_SEARCH.PAGE_SIZE);
    return pageSize ? Number(pageSize) : 25;
  }

  private saveUpdateSearchPageSize(pageSize: number) {
    localStorage.setItem(STORAGE_KEYS.STEAM_INSIGHT_MANAGEMENT.UPDATE_HISTORY.PAGE_SIZE, JSON.stringify(pageSize));
  }

  private loadUpdateSearchPageSize(): number {
    const pageSize = localStorage.getItem(STORAGE_KEYS.STEAM_INSIGHT_MANAGEMENT.UPDATE_HISTORY.PAGE_SIZE);
    return pageSize ? Number(pageSize) : 25;
  }
}
