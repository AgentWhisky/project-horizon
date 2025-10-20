import { Component, computed, effect, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe, UpperCasePipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { filter, tap } from 'rxjs';

import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';

import { PAGE_SIZE_OPTIONS, REFRESH_INTERVAL } from '@hz/core/constants';
import { HzOption } from '@hz/core/models';
import { DurationPipe, FormatDatePipe } from '@hz/core/pipes';
import { ScreenService } from '@hz/core/services';

import {
  HzBannerModule,
  HzBreadcrumbItem,
  HzBreadcrumbModule,
  HzCardModule,
  HzLoadingSpinnerModule,
  HzStatCardModule,
} from '@hz/shared/components';
import { ConfirmDialogComponent } from '@hz/shared/dialogs';

import { SteamInsightAppType, SteamInsightUpdateStatus, SteamInsightUpdateType } from './resources/steam-insight-management.enum';
import { SteamInsightApp, SteamInsightUpdate } from './resources/steam-insight-management.model';
import { APP_TYPE_OPTIONS, UPDATE_STATUS_OPTIONS, UPDATE_TYPE_OPTIONS } from './resources/steam-insight-management.const';

import { SteamInsightManagementService } from './steam-insight-management.service';
import { UpdateStatusPipe, UpdateStatusTypePipe, UpdateTypePipe } from './resources/steam-insight-management.pipe';

@Component({
  selector: 'hz-steam-insight-management',
  imports: [
    MatIconModule,
    MatTabsModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatTooltipModule,
    ReactiveFormsModule,
    CommonModule,
    HzStatCardModule,
    HzBannerModule,
    HzCardModule,
    HzBreadcrumbModule,
    HzLoadingSpinnerModule,
    UpperCasePipe,
    DatePipe,
    DurationPipe,
    FormatDatePipe,
    UpdateTypePipe,
    UpdateStatusPipe,
    UpdateStatusTypePipe,
  ],
  templateUrl: './steam-insight-management.component.html',
  styleUrl: './steam-insight-management.component.scss',
})
export class SteamInsightManagementComponent implements OnInit, OnDestroy {
  private screenService = inject(ScreenService);
  private dialog = inject(MatDialog);
  private router = inject(Router);
  private steamInsightMangementService = inject(SteamInsightManagementService);

  readonly breadcrumbItems: HzBreadcrumbItem[] = [
    { label: 'Administration', route: '/administration', icon: 'admin_panel_settings' },
    { label: 'Steam Insight Management', svgIcon: 'steam' },
  ];

  readonly isSmallScreen = this.screenService.isSmallScreen;
  readonly isMobileScreen = this.screenService.isMobileScreen;

  private refreshIntervalId?: ReturnType<typeof setInterval>;
  readonly currentTabIndex = this.steamInsightMangementService.currentTabIndex;

  /** DASHBOARD */
  readonly steamInsightDashboard = this.steamInsightMangementService.dashboard;
  readonly dashboardLoadingState = this.steamInsightMangementService.dashboardLoadingState;
  readonly runningUpdate = computed(() => this.steamInsightDashboard()?.runningUpdate);

  /** APP SEARCH */
  readonly steamInsightApps = this.steamInsightMangementService.apps;
  readonly appsPageLength = this.steamInsightMangementService.appsPageLength;
  readonly appsPage = this.steamInsightMangementService.appsPage;
  readonly appsPageSize = this.steamInsightMangementService.appsPageSize;
  readonly appsSearchForm = this.steamInsightMangementService.appsSearchForm;
  readonly appsTypeOptions = signal<HzOption<SteamInsightAppType>[]>(APP_TYPE_OPTIONS);
  readonly appsLoadingState = this.steamInsightMangementService.appsLoadingState;
  readonly appsDataSource = new MatTableDataSource<SteamInsightApp>();
  readonly appsDisplayedColumns = computed<string[]>(() =>
    this.isSmallScreen() ? ['appid', 'name', 'type'] : ['appid', 'name', 'type', 'isAdult', 'validationFailed', 'active']
  );

  /** UPDATE SEARCH */
  readonly steamInsightUpdates = this.steamInsightMangementService.updates;
  readonly updatesPageLength = this.steamInsightMangementService.updatesPageLength;
  readonly updatesPage = this.steamInsightMangementService.updatesPage;
  readonly updatesPageSize = this.steamInsightMangementService.updatesPageSize;
  readonly updatesSearchForm = this.steamInsightMangementService.updatesSearchForm;
  readonly updatesStatusOptions = signal<HzOption<SteamInsightUpdateStatus>[]>(UPDATE_STATUS_OPTIONS);
  readonly updatesTypeOptions = signal<HzOption<SteamInsightUpdateType>[]>(UPDATE_TYPE_OPTIONS);
  readonly updatesDataSource = new MatTableDataSource<SteamInsightUpdate>();
  readonly updatesLoadingState = this.steamInsightMangementService.updatesLoadingState;
  readonly steamInsightUpdatesDisplayedColumns = computed<string[]>(() =>
    this.isSmallScreen()
      ? ['startTime', 'endTime', 'updateStatus']
      : ['startTime', 'endTime', 'totalRuntime', 'updateStatus', 'updateType', 'notes']
  );

  readonly PAGE_SIZE_OPTIONS = PAGE_SIZE_OPTIONS;

  constructor() {
    effect(() => {
      this.appsDataSource.data = this.steamInsightMangementService.apps();
    });

    effect(() => {
      this.updatesDataSource.data = this.steamInsightMangementService.updates();
    });
  }

  ngOnInit() {
    this.loadTab();

    this.refreshIntervalId = setInterval(() => this.loadTab(), REFRESH_INTERVAL.NORMAL);
  }

  ngOnDestroy() {
    clearInterval(this.refreshIntervalId);
    this.steamInsightMangementService.reset();
  }

  /** TAB FUNCTIONS */
  loadTab() {
    const currentTabIndex = this.currentTabIndex();

    if (currentTabIndex === 0) {
      this.steamInsightMangementService.loadDashboard();
    } else if (currentTabIndex === 1) {
      this.steamInsightMangementService.loadApps();
    } else if (currentTabIndex === 2) {
      this.steamInsightMangementService.loadUpdates();
    }
  }

  onTabChange(event: MatTabChangeEvent) {
    const index = event.index;

    this.steamInsightMangementService.setCurrentTabIndex(index);

    // Steam Insight Dashboard
    if (index === 0) {
      this.steamInsightMangementService.loadDashboard();
    }

    // Steam Insight App Search
    if (index === 1) {
      this.steamInsightMangementService.loadApps();
    }

    // Steam Insight Update Search
    if (index === 2) {
      this.steamInsightMangementService.loadUpdates();
    }
  }

  /** DASHBAORD */
  onStartUpdate(isFullUpdate?: boolean) {
    const updateType = isFullUpdate ? 'Full' : 'Incremental';

    const title = `Start Update - ${updateType}?`;
    const message = 'Are you sure you want to start a Steam Insight Update';

    this.dialog
      .open(ConfirmDialogComponent, { data: { title, message }, panelClass: 'hz-dialog-container' })
      .afterClosed()
      .pipe(
        filter((result) => result),
        tap(() => this.steamInsightMangementService.startUpdate(isFullUpdate))
      )
      .subscribe();
  }

  onStopUpdate() {
    const title = `Stop In-Progress Update?`;
    const message = 'Are you sure you want to stop the in-progress Steam Insight Update';

    this.dialog
      .open(ConfirmDialogComponent, { data: { title, message }, panelClass: 'hz-dialog-container' })
      .afterClosed()
      .pipe(
        filter((result) => result),
        tap(() => this.steamInsightMangementService.stopUpdate())
      )
      .subscribe();
  }

  /** APP SEARCH */
  onAppSort(event: Sort) {
    const field = event.active;
    const direction = event.direction.toUpperCase();

    this.steamInsightMangementService.setAppSearchSort(field, direction);
  }

  onAppPageChange(event: PageEvent) {
    const newPage = event.pageIndex;
    const newPageSize = event.pageSize;
    this.steamInsightMangementService.setAppSearchPage(newPage, newPageSize);
  }

  onResetAppSearchFilters() {
    this.steamInsightMangementService.resetAppSearchFilters();
  }

  onViewApp(row: SteamInsightApp) {
    this.router.navigate(['administration', 'steam-insight-management', 'app', row.appid]);
  }

  /** UPDATE SEARCH */
  onUpdateSort(event: Sort) {
    const field = event.active;
    const direction = event.direction.toUpperCase();

    this.steamInsightMangementService.setUpdateSearchSort(field, direction);
  }

  onUpdatePageChange(event: PageEvent) {
    const newPage = event.pageIndex;
    const newPageSize = event.pageSize;
    this.steamInsightMangementService.setUpdateSearchPage(newPage, newPageSize);
  }

  onResetUpdateSearchFilters() {
    this.steamInsightMangementService.resetUpdateSearchFilters();
  }

  onViewUpdate(row: SteamInsightUpdate) {
    this.router.navigate(['administration', 'steam-insight-management', 'update', row.id]);
  }
}
