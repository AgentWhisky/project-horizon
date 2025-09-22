import { Component, computed, effect, inject, OnDestroy, OnInit, signal, viewChild } from '@angular/core';

import { LOADING_STATUS, REFRESH_INTERVAL } from '@hz/core/constants';

import { SteamInsightManagementService } from './steam-insight-management.service';
import { HzBannerModule, HzChipModule, HzStatCardModule } from '@hz/shared/components';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { HzOption, HzStatusType } from '@hz/core/models';
import { getRuntimeMs } from '@hz/core/utilities';
import { HzCardModule } from '@hz/shared/components/hz-card';
import { DatePipe } from '@angular/common';
import { DurationPipe, FormatDatePipe } from '@hz/core/pipes';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SteamInsightUpdate, SteamInsightUpdateRow } from './resources/steam-insight-management.model';
import { ScreenService } from '@hz/core/services';
import { UpdateStatus, UpdateType } from './resources/steam-insight-management.enum';
import { MatIconModule } from '@angular/material/icon';
import { getUpdateStatus, getUpdateStatusType, getUpdateType } from './resources/steam-insight-management.utils';
import { MatSelectModule } from '@angular/material/select';
import { UPDATE_STATUS_OPTIONS, UPDATE_TYPE_OPTIONS } from './resources/steam-insight-management.const';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { SteamInsightUpdateHistoryDialogComponent } from './dialogs/steam-insight-update-history-dialog/steam-insight-update-history-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { PAGE_SIZE_OPTIONS } from '@hz/core/constants/pagination.constants';
import { ConfirmDialogComponent } from '@hz/shared/dialogs';
import { filter, tap } from 'rxjs';

@Component({
  selector: 'hz-steam-insight-management',
  imports: [
    MatDividerModule,
    MatIconModule,
    MatTabsModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    ReactiveFormsModule,
    HzStatCardModule,
    HzBannerModule,
    HzCardModule,
    HzChipModule,
    DatePipe,
    DurationPipe,
    FormatDatePipe,
  ],
  templateUrl: './steam-insight-management.component.html',
  styleUrl: './steam-insight-management.component.scss',
})
export class SteamInsightManagementComponent implements OnInit, OnDestroy {
  private screenService = inject(ScreenService);
  private dialog = inject(MatDialog);
  private steamInsightMangementService = inject(SteamInsightManagementService);

  private intervalId?: ReturnType<typeof setInterval>;

  readonly LOADING_STATUS = LOADING_STATUS;
  readonly isSmallScreen = this.screenService.isSmallScreen;

  /** DASHBOARD */
  readonly steamInsightDashboard = this.steamInsightMangementService.dashboard;
  readonly dashboardLoadingStatus = this.steamInsightMangementService.dashboardLoadingStatus;
  readonly runningUpdate = computed(() => this.steamInsightDashboard()?.runningUpdate);

  /** UPDATE SEARCH */
  readonly steamInsightUpdatesDisplayedColumns = computed<string[]>(() =>
    this.isSmallScreen()
      ? ['startTime', 'endTime', 'updateStatus']
      : ['startTime', 'endTime', 'totalRuntime', 'updateStatus', 'updateType', 'notes']
  );
  readonly steamInsightUpdatesDataSource = new MatTableDataSource<SteamInsightUpdateRow>();
  readonly steamInsightUpdatesPageLength = this.steamInsightMangementService.steamInsightUpdatesPageLength;
  readonly steamInsightUpdatesPage = this.steamInsightMangementService.steamInsightUpdatesPage;
  readonly steamInsightUpdatesPageSize = this.steamInsightMangementService.steamInsightUpdatesPageSize;
  readonly steamInsightUpdatesSearchForm = this.steamInsightMangementService.steamInsightUpdatesSearchForm;

  readonly steamInsightUpdatesStatusOptions = signal<HzOption<UpdateStatus>[]>(UPDATE_STATUS_OPTIONS);
  readonly steamInsightUpdatesTypeOptions = signal<HzOption<UpdateType>[]>(UPDATE_TYPE_OPTIONS);

  readonly steamInsightUpdatesLoadingStatus = this.steamInsightMangementService.steamInsightUpdatesLoadingStatus;

  // MOVE TO FUNCTION
  readonly steamInsightUpdateRows = computed<SteamInsightUpdateRow[]>(() =>
    this.steamInsightMangementService.steamInsightUpdates().map((update) => {
      const startTime = update.startTime ? new Date(update.startTime) : null;
      const endTime = update.endTime ? new Date(update.endTime) : null;

      const totalRuntime = startTime && endTime ? Math.floor((endTime.getTime() - startTime.getTime()) / 1000) : 0;

      const row = {
        id: update.id,
        startTime,
        endTime,
        totalRuntime,
        updateStatus: getUpdateStatus(update.updateStatus),
        updateStatusType: getUpdateStatusType(update.updateStatus),
        updateType: getUpdateType(update.updateType),
        notes: update.notes,
        stats: update.stats,
        events: update.events,
      };

      return row;
    })
  );

  readonly PAGE_SIZE_OPTIONS = PAGE_SIZE_OPTIONS;

  readonly getUpdateType = getUpdateType;
  readonly getUpdateStatus = getUpdateStatus;
  readonly getUpdateStatusType = getUpdateStatusType;

  constructor() {
    effect(() => {
      this.steamInsightUpdatesDataSource.data = this.steamInsightUpdateRows();
    });
  }

  ngOnInit() {
    this.steamInsightMangementService.loadDashboard();
    this.steamInsightMangementService.loadUpdateHistory();

    this.intervalId = setInterval(() => {
      this.steamInsightMangementService.loadDashboard();
    }, REFRESH_INTERVAL.NORMAL);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  /** TABS */
  onTabChange(event: MatTabChangeEvent) {
    const index = event.index;

    // Steam Insight Dashboard
    if (index === 0) {
      this.steamInsightMangementService.loadDashboard();
    }

    // Steam Insight Update Search
    if (index === 2) {
      this.steamInsightMangementService.loadUpdateHistory();
    }
  }

  /** STEAM INSIGHT DASHBAORD */
  onStartUpdate(isFullUpdate?: boolean) {
    const updateType = isFullUpdate ? 'Full' : 'Incremental';

    const title = `Start Update - ${updateType}`;
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
    this.steamInsightMangementService.stopUpdate();
  }

  /** STEAM INSIGHT UPDATE HISTORY SEARCH */
  onSteamInsightUpdatesSort(event: Sort) {
    const field = event.active;
    const direction = event.direction.toUpperCase();

    this.steamInsightMangementService.updateSteamUpdateHistorySort(field, direction);
  }

  onSteamInsightUpdatesPageChange(event: PageEvent) {
    const newPage = event.pageIndex;
    const newPageSize = event.pageSize;
    this.steamInsightMangementService.updateSteamUpdateHistoryPage(newPage, newPageSize);
  }

  onResetFilters() {
    this.steamInsightMangementService.resetFilters();
  }

  onSteamInsightUpdatesRowClick(row: SteamInsightUpdateRow) {
    this.dialog.open(SteamInsightUpdateHistoryDialogComponent, {
      data: { row },
      width: '560px',
      panelClass: 'hz-dialog-container',
    });
  }
}
