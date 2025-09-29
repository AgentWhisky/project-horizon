import { Component, inject, OnInit } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ScreenService } from '@hz/core/services';
import { SNACKBAR_INTERVAL } from '@hz/core/constants';

import { AdminDashboardService } from './admin-dashboard.service';

@Component({
  selector: 'hz-admin-dashboard',
  imports: [MatCardModule, MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
})
export class AdminDashboardComponent implements OnInit {
  private adminDashboardService = inject(AdminDashboardService);
  private snackbar = inject(MatSnackBar);
  private screenService = inject(ScreenService);

  readonly isSmallScreen = this.screenService.isSmallScreen;
  readonly dashboardInfo = this.adminDashboardService.dashboardInfo;

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
