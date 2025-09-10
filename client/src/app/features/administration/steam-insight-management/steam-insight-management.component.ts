import { Component, inject, OnDestroy, OnInit } from '@angular/core';

import { REFRESH_INTERVAL } from '@hz/core/constants';

import { SteamInsightManagementService } from './steam-insight-management.service';
import { HzStatCardModule } from '@hz/shared/components';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'hz-steam-insight-management',
  imports: [MatDividerModule, MatTabsModule, HzStatCardModule],
  templateUrl: './steam-insight-management.component.html',
  styleUrl: './steam-insight-management.component.scss',
})
export class SteamInsightManagementComponent implements OnInit, OnDestroy {
  private steamInsightMangementService = inject(SteamInsightManagementService);

  private intervalId?: ReturnType<typeof setInterval>;

  readonly steamInsightDashboard = this.steamInsightMangementService.dashboard;

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
