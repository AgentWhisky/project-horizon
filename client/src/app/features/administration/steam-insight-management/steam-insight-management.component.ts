import { Component, inject, OnDestroy, OnInit, viewChild } from '@angular/core';

import { REFRESH_INTERVAL } from '@hz/core/constants';

import { SteamInsightManagementService } from './steam-insight-management.service';
import { HzStatCardModule } from '@hz/shared/components';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { SteamInsightUpdate } from './steam-insight-management.model';

@Component({
  selector: 'hz-steam-insight-management',
  imports: [MatDividerModule, MatTabsModule, MatTableModule, HzStatCardModule],
  templateUrl: './steam-insight-management.component.html',
  styleUrl: './steam-insight-management.component.scss',
})
export class SteamInsightManagementComponent implements OnInit, OnDestroy {
  private steamInsightMangementService = inject(SteamInsightManagementService);

  private intervalId?: ReturnType<typeof setInterval>;

  readonly steamInsightDashboard = this.steamInsightMangementService.dashboard;

  readonly steamInsightUpdatesSort = viewChild<MatSort>('steamInsightUpdatesSort');
  readonly steamInsightUpdatesPaginator = viewChild<MatPaginator>('steamInsightUpdatesPaginator');
  readonly steamInsightUpdatesDisplayedColumns: string[] = ['id', 'name', 'description', 'active', 'rights', 'actions'];
  readonly steamInsightUpdatesDataSource = new MatTableDataSource<SteamInsightUpdate>();

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
}
