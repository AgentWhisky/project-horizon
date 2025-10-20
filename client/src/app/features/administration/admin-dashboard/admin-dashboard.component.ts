import { Component, inject, OnDestroy, OnInit } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ScreenService } from '@hz/core/services';
import { REFRESH_INTERVAL, SNACKBAR_INTERVAL } from '@hz/core/constants';
import { HzBannerModule, HzBreadcrumbItem, HzBreadcrumbModule, HzLoadingSpinnerModule, HzCardModule } from '@hz/shared/components';

import { AdminDashboardService } from './admin-dashboard.service';

@Component({
  selector: 'hz-admin-dashboard',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    HzBannerModule,
    HzBreadcrumbModule,
    HzLoadingSpinnerModule,
    HzCardModule,
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  private adminDashboardService = inject(AdminDashboardService);
  private snackbar = inject(MatSnackBar);
  private screenService = inject(ScreenService);

  readonly breadcrumbItems: HzBreadcrumbItem[] = [
    { label: 'Administration', route: '/administration', icon: 'admin_panel_settings' },
    { label: 'Dashboard' },
  ];

  readonly isSmallScreen = this.screenService.isSmallScreen;

  private refreshIntervalId?: ReturnType<typeof setInterval>;

  readonly dashboardInfo = this.adminDashboardService.dashboardInfo;
  readonly loadingState = this.adminDashboardService.loadingState;

  ngOnInit() {
    this.adminDashboardService.loadDashboard();
    this.refreshIntervalId = setInterval(() => this.adminDashboardService.loadDashboard(), REFRESH_INTERVAL.NORMAL);
  }

  ngOnDestroy() {
    clearInterval(this.refreshIntervalId);
    this.adminDashboardService.reset();
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
