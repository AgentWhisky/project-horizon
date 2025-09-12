import { Component, computed, effect, inject, model, OnInit, viewChild } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { AdminDashboardService } from './admin-dashboard.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { SteamAppUpdateLogDisplay } from './admin-dashboard';
import { MatTabsModule } from '@angular/material/tabs';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatExpansionModule } from '@angular/material/expansion';

import { FormsModule } from '@angular/forms';
import { DurationPipe } from '@hz/core/pipes';
import { ScreenService } from '@hz/core/services';
import { SNACKBAR_INTERVAL } from '@hz/core/constants';

@Component({
  selector: 'hz-admin-dashboard',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatTooltipModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatTabsModule,
    MatExpansionModule,
    FormsModule,
    DurationPipe,
    DatePipe,
    DecimalPipe,
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
})
export class AdminDashboardComponent implements OnInit {
  private adminDashboardService = inject(AdminDashboardService);
  private snackbar = inject(MatSnackBar);
  private screenService = inject(ScreenService);

  readonly isSmallScreen = this.screenService.isSmallScreen;
  readonly dashboardInfo = this.adminDashboardService.dashboardInfo;

  // Steam App Update Logs Table
  readonly appUpdateLogsSort = viewChild<MatSort>('appUpdateLogsSort');
  readonly appUpdateLogsPaginator = viewChild<MatPaginator>('appUpdateLogsPaginator');
  readonly appUpdateLogsDisplayedColumns = computed(() =>
    this.isSmallScreen()
      ? ['startTime', 'runtime', 'failureCount']
      : ['startTime', 'runtime', 'createdGameCount', 'updatedGameCount', 'createdDlcCount', 'updatedDlcCount', 'failureCount', 'notes']
  );
  readonly appUpdateLogsDataSource = new MatTableDataSource<SteamAppUpdateLogDisplay>();

  readonly steamAppid = model<number>();

  constructor() {
    effect(() => {
      this.appUpdateLogsDataSource.data = this.dashboardInfo().steamInsight.logs.map((log) => {
        const start = new Date(log.startTime);
        const end = new Date(log.endTime);
        const runtime = end.getTime() - start.getTime();

        return {
          startTime: log.startTime,
          runtime,
          successCount: log.successCount,
          failureCount: log.failureCount,
          successAppIds: log.successAppIds,
          failureAppIds: log.failureAppIds,
          createdGameCount: log.createdGameCount,
          createdDlcCount: log.createdDlcCount,
          updatedGameCount: log.updatedGameCount,
          updatedDlcCount: log.updatedDlcCount,
          notes: log.notes,
        };
      });
    });

    effect(() => {
      this.appUpdateLogsDataSource.sort = this.appUpdateLogsSort() ?? null;
      this.appUpdateLogsDataSource.paginator = this.appUpdateLogsPaginator() ?? null;
    });
  }

  ngOnInit() {
    this.adminDashboardService.loadDashboard();
  }

  onRefreshDashboard() {
    this.adminDashboardService.loadDashboard(true);
  }

  onSearchSteamAppid() {
    console.log('APPID', this.steamAppid());
  }

  onCopyToClipboard(text: string) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        this.snackbar.open(`Successfully copied to clipboard`, 'Close', { duration: SNACKBAR_INTERVAL.NORMAL });
      })
      .catch(() => {
        this.snackbar.open(`Failed to copy to clipboard`, 'Close', { duration: SNACKBAR_INTERVAL.NORMAL });
      });
  }

  onRefreshCreationCode() {
    this.adminDashboardService.refreshCreationCode();
  }
}
