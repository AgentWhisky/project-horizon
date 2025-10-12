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

  readonly dashboard = signal<SteamInsightDashboard | null>(null);
  readonly dashboardLoadingState = new HzLoadingState('Steam Insight Dashboard', { persistSuccess: true });

  readonly currentTabIndex = signal<number>(0);

  /** App Search */
  readonly apps = signal<SteamInsightApp[]>([]);
  readonly appsLoadingState = new HzLoadingState('Steam Insight Apps', { persistSuccess: true });
  readonly appsPageLength = signal<number>(0);
  readonly appsSortBy = signal<SteamInsightAppField | null>(null);
  readonly appsSortOrder = signal<SortOrder | null>(null);
  readonly appsPage = signal<number>(0);
  readonly appsPageSize = signal<number>(this.loadAppSearchPageSize());
  readonly appsSearchForm = this.getAppSearchForm();

  /** Update Search */
  readonly updates = signal<SteamInsightUpdate[]>([]);
  readonly updatesLoadingState = new HzLoadingState('Steam Insight Updates', { persistSuccess: true });
  readonly updatesPageLength = signal<number>(0);
  readonly updatesSortBy = signal<SteamInsightUpdateField | null>(null);
  readonly updatesSortOrder = signal<SortOrder | null>(null);
  readonly updatesPage = signal<number>(0);
  readonly updatesPageSize = signal<number>(this.loadUpdateSearchPageSize());
  readonly updatesSearchForm = this.getUpdateSearchForm();

  /** GENERAL */
  setCurrentTabIndex(index: number = 0) {
    this.currentTabIndex.set(index);
  }

  /** DASHBOARD */
  loadDashboard() {
    if (this.dashboardLoadingState.isLoading()) {
      return;
    }

    this.dashboardLoadingState.setInProgress();

    this.tokenService
      .getWithTokenRefresh<SteamInsightDashboard>(`/steam-insight-management/dashboard`)
      .pipe(
        tap((response) => {
          this.dashboard.set(response);
          this.dashboardLoadingState.setSuccess();
        }),
        catchError((err: HttpErrorResponse) => {
          this.dashboardLoadingState.setFailed(err.status);
          console.error(`Failed to fetch Steam Insight Dashboard`, { error: err });
          return of(null);
        })
      )
      .subscribe();
  }

  clearDashboard() {
    this.dashboard.set(null);
    this.dashboardLoadingState.reset();
  }

  startUpdate(isFullUpdate?: boolean) {
    const updateType = isFullUpdate ? SteamInsightUpdateType.FULL : SteamInsightUpdateType.INCREMENTAL;

    this.tokenService
      .postWithTokenRefresh('/steam-insight-management/update/start', { type: updateType })
      .pipe(
        tap(() => this.loadDashboard()),
        catchError((err: HttpErrorResponse) => {
          console.error(`Failed to start Steam Insight Update`, { error: err });
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
          console.error(`Failed to stop Steam Insight Update`, { error: err });
          return of(null);
        })
      )
      .subscribe();
  }

  /** APP SEARCH */
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
        tap((response) => {
          this.apps.set(response.apps);
          this.appsPageLength.set(response.pageLength);
          this.appsLoadingState.setSuccess();
        }),
        catchError((err: HttpErrorResponse) => {
          this.appsLoadingState.setFailed(err.status);
          console.error(`Failed to fetch Steam Insight Apps`, { error: err });
          return of(null);
        })
      )
      .subscribe();
  }

  setAppSearchSort(sortBy: string, sortOrder: string) {
    const isValidOrder = sortOrder === 'ASC' || sortOrder === 'DESC';

    this.appsSortBy.set(isValidOrder ? (sortBy as SteamInsightAppField) : null);
    this.appsSortOrder.set(isValidOrder ? (sortOrder as SortOrder) : null);
    this.appsPage.set(0);

    this.loadApps();
  }

  setAppSearchPage(page: number, pageSize: number) {
    this.appsPage.set(page);
    this.appsPageSize.set(pageSize);

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

  /** UPDATE SEARCH */
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
        tap((response) => {
          this.updates.set(response.updates);
          this.updatesPageLength.set(response.pageLength);
          this.updatesLoadingState.setSuccess();
        }),
        catchError((err: HttpErrorResponse) => {
          this.updatesLoadingState.setFailed(err.status);
          console.error(`Failed to fetch Steam Insight Updates`, { error: err });
          return of(null);
        })
      )
      .subscribe();
  }

  setUpdateSearchSort(sortBy: string, sortOrder: string) {
    const isValidOrder = sortOrder === 'ASC' || sortOrder === 'DESC';

    this.updatesSortBy.set(isValidOrder ? (sortBy as SteamInsightUpdateField) : null);
    this.updatesSortOrder.set(isValidOrder ? (sortOrder as SortOrder) : null);
    this.updatesPage.set(0);

    this.loadUpdates();
  }

  setUpdateSearchPage(page: number, pageSize: number) {
    this.updatesPage.set(page);
    this.updatesPageSize.set(pageSize);

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
