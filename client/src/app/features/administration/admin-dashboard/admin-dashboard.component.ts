import { Component, computed, effect, inject, OnInit, viewChild } from '@angular/core';

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
import { DurationPipe } from '../../../core/pipes/duration.pipe';
import { ScreenService } from '../../../core/services/screen.service';
import { DatePipe, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
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

  onCopyToClipboard(text: string) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        this.snackbar.open(`Successfully copied to clipboard`, 'Close', { duration: 3000 });
      })
      .catch(() => {
        this.snackbar.open(`Failed to copy to clipboard`, 'Close', { duration: 3000 });
      });
  }

  onRefreshCreationCode() {
    this.adminDashboardService.refreshCreationCode();
  }
}
