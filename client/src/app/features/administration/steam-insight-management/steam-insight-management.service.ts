import { effect, inject, Injectable, OnInit, signal, untracked } from '@angular/core';
import { firstValueFrom, tap } from 'rxjs';

import { MatSnackBar } from '@angular/material/snack-bar';

import { TokenService } from '@hz/core/services';
import { LOADING_STATUS, SNACKBAR_INTERVAL, STORAGE_KEYS } from '@hz/core/constants';
import {
  SteamInsightAppResponse,
  SteamInsightDashboard,
  SteamInsightUpdate,
  SteamInsightUpdateSearchResponse,
  SteamInsightUpdatesQuery,
} from './resources/steam-insight-management.model';
import { cleanObject, sleep } from '@hz/core/utilities';
import { HttpParams } from '@angular/common/http';
import { SortOrder } from '@hz/core/enums';
import { SteamInsightAppField, SteamInsightUpdateField, UpdateStatus, UpdateType } from './resources/steam-insight-management.enum';
import { FormBuilder, FormControl } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class SteamInsightManagementService {
  private tokenService = inject(TokenService);
  private fb = inject(FormBuilder);
  private snackbar = inject(MatSnackBar);

  readonly dashboard = signal<SteamInsightDashboard | null>(null);
  readonly dashboardLoadingStatus = signal<number>(LOADING_STATUS.NOT_LOADED);

  /** Steam Insight App Search */
  readonly steamInsightApps = signal<SteamInsightAppResponse[]>([]);
  readonly steamInsightAppsLoadingStatus = signal<number>(LOADING_STATUS.NOT_LOADED);
  readonly steamInsightAppsPageLength = signal<number>(0);
  readonly steamInsightAppsSortBy = signal<SteamInsightAppField | null>(null);
  readonly steamInsightAppsSortOrder = signal<SortOrder | null>(null);
  readonly steamInsightAppsPage = signal<number>(0);
  readonly steamInsightAppsPageSize = signal<number>(this.loadUpdateHistoryPageSize());
  readonly steamInsightAppsSearchForm = this.getSteamUpdateHistorySearchForm();

  /** Steam Insight Updates */
  readonly steamInsightUpdates = signal<SteamInsightUpdate[]>([]);
  readonly steamInsightUpdatesLoadingStatus = signal<number>(LOADING_STATUS.NOT_LOADED);
  readonly steamInsightUpdatesPageLength = signal<number>(0);
  readonly steamInsightUpdatesSortBy = signal<SteamInsightUpdateField | null>(null);
  readonly steamInsightUpdatesSortOrder = signal<SortOrder | null>(null);
  readonly steamInsightUpdatesPage = signal<number>(0);
  readonly steamInsightUpdatesPageSize = signal<number>(this.loadUpdateHistoryPageSize());
  readonly steamInsightUpdatesSearchForm = this.getSteamUpdateHistorySearchForm();

  constructor() {
    this.steamInsightUpdatesSearchForm.valueChanges.pipe(tap(() => this.loadUpdateHistory())).subscribe();
  }

  async loadDashboard() {
    try {
      // Keep status as success to prevent showing loading spinner during updates to dashboard
      if (this.dashboardLoadingStatus() !== LOADING_STATUS.SUCCESS) {
        this.dashboardLoadingStatus.set(LOADING_STATUS.IN_PROGRESS);
      }
      const steamInsightDashboard = await this.getDashboard();
      this.dashboard.set(steamInsightDashboard);
      this.dashboardLoadingStatus.set(LOADING_STATUS.SUCCESS);
    } catch (error) {
      this.dashboardLoadingStatus.set(LOADING_STATUS.FAILED);
      console.error(`Error fetching dashboard: ${error}`);
    }
  }

  async startUpdate(isFullUpdate?: boolean) {
    try {
      await this.postStartUpdate(isFullUpdate);
      this.snackbar.open('Steam insight update has been started', 'Close', { duration: SNACKBAR_INTERVAL.NORMAL });
    } catch (error) {
      console.error(`Error starting steam insight update: ${error}`);
      this.snackbar.open('Failed to start steam insight update', 'Close', { duration: SNACKBAR_INTERVAL.NORMAL });
    } finally {
      await sleep(1000); // 1s delay before refreshing dashboard
      this.loadDashboard();
    }
  }

  async stopUpdate() {
    try {
      await this.postStopUpdate();
    } catch (error: any) {
      const status = error?.status;

      console.error(`Error stopping steam insight update: ${error}`);
      if (status === 409) {
        this.snackbar.open('No steam insight update is running', 'Close', { duration: SNACKBAR_INTERVAL.NORMAL });
      } else {
        this.snackbar.open('Failed to stop steam insight update', 'Close', { duration: SNACKBAR_INTERVAL.NORMAL });
      }
    } finally {
      await sleep(1000); // 1s delay before refreshing dashboard
      this.loadDashboard();
    }
  }

  // *** STEAM INSIGHT APP SEARCH ***
  async loadAppSearch() {}

  updateSteamAppSearchSort(sortBy: string, sortOrder: string) {
    if (sortOrder === 'ASC' || sortOrder === 'DESC') {
      this.steamInsightAppsSortBy.set(null);
      this.steamInsightAppsSortOrder.set(null);
    }

    this.steamInsightAppsSortBy.set(sortBy as SteamInsightAppField);
    this.steamInsightAppsSortOrder.set(sortOrder as SortOrder);

    this.steamInsightAppsPage.set(0);
    this.loadAppSearch();
  }

  updateSteamAppSearchPage(page: number, pageSize: number) {
    this.steamInsightAppsPage.set(page);
    this.steamInsightAppsPageSize.set(pageSize);

    this.saveAppSearchPageSize(pageSize);
    this.loadAppSearch();
  }

  getSteamAppSearchForm() {
    return this.fb.group({
      appid: new FormControl<number | null>(null),
      sortBy: new FormControl<UpdateType | null>(null),
    });
  }

  resetAppSearchFilters() {
    this.steamInsightAppsSearchForm.reset();
  }

  // *** UPDATE HISTORY SEARCH ***
  async loadUpdateHistory(query: SteamInsightUpdatesQuery = {}) {
    try {
      this.steamInsightUpdatesLoadingStatus.set(LOADING_STATUS.IN_PROGRESS);

      query.page = this.steamInsightUpdatesPage();
      query.pageSize = this.steamInsightUpdatesPageSize();
      query.sortBy = this.steamInsightUpdatesSortBy() ?? undefined;
      query.sortOrder = this.steamInsightUpdatesSortOrder() ?? undefined;

      query.status = this.steamInsightUpdatesSearchForm.get('statuses')?.value ?? undefined;
      query.type = this.steamInsightUpdatesSearchForm.get('type')?.value ?? undefined;

      query = cleanObject(query);

      const response = await this.getUpdateHistory(query);
      this.steamInsightUpdates.set(response.updates);
      this.steamInsightUpdatesPageLength.set(response.pageLength);
      this.steamInsightUpdatesLoadingStatus.set(LOADING_STATUS.SUCCESS);
    } catch (error) {
      this.steamInsightUpdatesLoadingStatus.set(LOADING_STATUS.FAILED);
      console.error(`Error fetching steam insight updates: ${error}`);
    }
  }

  updateSteamUpdateHistorySort(sortBy: string, sortOrder: string) {
    if (sortOrder === 'ASC' || sortOrder === 'DESC') {
      this.steamInsightUpdatesSortBy.set(null);
      this.steamInsightUpdatesSortOrder.set(null);
    }

    this.steamInsightUpdatesSortBy.set(sortBy as SteamInsightUpdateField);
    this.steamInsightUpdatesSortOrder.set(sortOrder as SortOrder);

    this.steamInsightUpdatesPage.set(0);
    this.loadUpdateHistory();
  }

  updateSteamUpdateHistoryPage(page: number, pageSize: number) {
    this.steamInsightUpdatesPage.set(page);
    this.steamInsightUpdatesPageSize.set(pageSize);

    this.saveUpdateHistoryPageSize(pageSize);
    this.loadUpdateHistory();
  }

  getSteamUpdateHistorySearchForm() {
    return this.fb.group({
      statuses: new FormControl<UpdateStatus[]>([]),
      type: new FormControl<UpdateType | null>(null),
    });
  }

  resetUpdateSearchFilters() {
    this.steamInsightUpdatesSearchForm.reset();
  }

  // PRIVATE SERVICE FUNCTIONS
  private saveAppSearchPageSize(pageSize: number) {
    localStorage.setItem(STORAGE_KEYS.STEAM_INSIGHT_MANAGEMENT.APP_SEARCH.PAGE_SIZE, JSON.stringify(pageSize));
  }

  private loadAppSearchPageSize(): number {
    const pageSize = localStorage.getItem(STORAGE_KEYS.STEAM_INSIGHT_MANAGEMENT.APP_SEARCH.PAGE_SIZE);
    return pageSize ? Number(pageSize) : 25;
  }

  private saveUpdateHistoryPageSize(pageSize: number) {
    localStorage.setItem(STORAGE_KEYS.STEAM_INSIGHT_MANAGEMENT.UPDATE_HISTORY.PAGE_SIZE, JSON.stringify(pageSize));
  }

  private loadUpdateHistoryPageSize(): number {
    const pageSize = localStorage.getItem(STORAGE_KEYS.STEAM_INSIGHT_MANAGEMENT.UPDATE_HISTORY.PAGE_SIZE);
    return pageSize ? Number(pageSize) : 25;
  }

  // PRIVATE API FUNCTIONS
  private async getDashboard() {
    const steamStats$ = this.tokenService.getWithTokenRefresh<SteamInsightDashboard>(`/steam-insight-management/dashboard`);
    return firstValueFrom(steamStats$);
  }

  private async postStartUpdate(isFullUpdate?: boolean) {
    const updateType = isFullUpdate ? UpdateType.FULL : UpdateType.INCREMENTAL;

    const response$ = this.tokenService.postWithTokenRefresh('/steam-insight-management/update/start', { type: updateType });

    return firstValueFrom(response$);
  }

  private async postStopUpdate() {
    const response$ = this.tokenService.postWithTokenRefresh('/steam-insight-management/update/stop', {});

    return firstValueFrom(response$);
  }

  private async getUpdateHistory(query: SteamInsightUpdatesQuery) {
    const params = new HttpParams({ fromObject: query as any });

    const steamInsightUpdates$ = this.tokenService.getWithTokenRefresh<SteamInsightUpdateSearchResponse>(
      `/steam-insight-management/updates`,
      {
        params,
      }
    );
    return firstValueFrom(steamInsightUpdates$);
  }
}
