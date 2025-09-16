import { Component, inject, OnDestroy, OnInit } from '@angular/core';

import { LOADING_STATUS, REFRESH_INTERVAL } from '@hz/core/constants';

import { SteamInsightManagementService } from './steam-insight-management.service';
import { HzBannerModule, HzStatCardModule } from '@hz/shared/components';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'hz-steam-insight-management',
  imports: [MatDividerModule, MatTabsModule, HzStatCardModule],
  templateUrl: './steam-insight-management.component.html',
  styleUrl: './steam-insight-management.component.scss',
})
export class SteamInsightManagementComponent implements OnInit, OnDestroy {
  [x: string]: any;
  private steamInsightMangementService = inject(SteamInsightManagementService);

  private intervalId?: ReturnType<typeof setInterval>;

  readonly LOADING_STATUS = LOADING_STATUS;

  readonly steamInsightDashboard = this.steamInsightMangementService.dashboard;

  readonly steamInsightUpdatesSort = viewChild<MatSort>('steamInsightUpdatesSort');
  readonly steamInsightUpdatesPaginator = viewChild<MatPaginator>('steamInsightUpdatesPaginator');
  readonly steamInsightUpdatesDisplayedColumns: string[] = ['id', 'name', 'description', 'active', 'rights', 'actions'];
  readonly steamInsightUpdatesDataSource = new MatTableDataSource<SteamInsightUpdate>();
  readonly dashboardLoadingStatus = this.steamInsightMangementService.dashboardLoadingStatus;

  readonly runningUpdate = computed(() => this.steamInsightDashboard()?.runningUpdate);

  ngOnInit() {
    this.steamInsightMangementService.loadDashboard();

    this.intervalId = setInterval(() => {
      this.steamInsightMangementService.loadDashboard();
    }, REFRESH_INTERVAL.NORMAL);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  getUpdateType(code: string): string {
    switch (code) {
      case 'I':
        return 'Incremental';
      case 'F':
        return 'Full';
      default:
        return code;
    }
  }

  getUpdateStatus(code: string): string {
    switch (code) {
      case 'R':
        return 'Run';
      case 'C':
        return 'Complete';
      case 'X':
        return 'Canceled';
      case 'F':
        return 'Failed';
      default:
        return code;
    }
  }

  getUpdateStatusType(code: string): HzStatusType {
    switch (code) {
      case 'R':
        return 'base';
      case 'C':
        return 'success';
      case 'X':
        return 'warning';
      case 'F':
        return 'error';
      default:
        return 'base';
    }
  }

  getRuntime(startTime: Date, endTime?: Date) {
    if (!endTime) {
      endTime = new Date();
    }

    return getRuntimeMs(startTime, endTime);
  }
}
