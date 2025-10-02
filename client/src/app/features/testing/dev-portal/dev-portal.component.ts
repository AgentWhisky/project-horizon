import { Component, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';

import { HzStatusType } from '@hz/core/models';
import { SNACKBAR_INTERVAL } from '@hz/core/constants';
import { HzBannerModule, HzBreadcrumbItem, HzBreadcrumbModule, HzCardModule, HzChipModule } from '@hz/shared/components';

@Component({
  selector: 'hz-dev-portal',
  imports: [MatButtonModule, MatIconModule, MatTabsModule, RouterModule, HzBannerModule, HzChipModule, HzCardModule, HzBreadcrumbModule],
  templateUrl: './dev-portal.component.html',
  styleUrl: './dev-portal.component.scss',
})
export class DevPortalComponent {
  private snackbar = inject(MatSnackBar);

  readonly types = signal<HzStatusType[]>(['success', 'warning', 'error', 'primary', 'base']);

  // Hz Breadcrumb
  readonly breadcrumbSet1: HzBreadcrumbItem[] = [
    { label: 'Root', route: '/root' },
    { label: 'Route 1', route: '/root/route1' },
    { label: 'Route 2', route: '/root/route1/route2' },
    { label: 'Route 3', route: '/root/route1/route2/route3' },
    { label: 'Route 4', route: '/root/route1/route2/route3/route4' },
  ];

  readonly breadcrumbSet2: HzBreadcrumbItem[] = [
    { label: 'Root', route: '/root', icon: 'line_start_circle' },
    { label: 'Route 1', route: '/root/route1', icon: 'counter_1' },
    { label: 'Route 2', route: '/root/route1/route2', icon: 'counter_2' },
    { label: 'Route 3', route: '/root/route1/route2/route3', icon: 'counter_3' },
    { label: 'Route 4', route: '/root/route1/route2/route3/route4', icon: 'counter_4' },
  ];

  readonly breadcrumbSet3: HzBreadcrumbItem[] = [
    { label: 'Root', route: '/root', icon: 'line_start_circle' },
    { label: 'Route 1', route: '/root/route1', icon: 'counter_1', disabled: true },
    { label: 'Route 2', route: '/root/route1/route2', icon: 'counter_2', disabled: true },
    { label: 'Route 3', route: '/root/route1/route2/route3', icon: 'counter_3' },
    { label: 'Route 4', route: '/root/route1/route2/route3/route4', icon: 'counter_4' },
  ];

  readonly breadcrumbSet4: HzBreadcrumbItem[] = [
    { label: 'Root', route: '/root', icon: 'line_start_circle', tooltip: 'Root' },
    { label: 'Route 1', route: '/root/route1', icon: 'counter_1', tooltip: 'Route 1' },
    { label: 'Route 2', route: '/root/route1/route2', icon: 'counter_2', tooltip: 'Route 2' },
    { label: 'Route 3', route: '/root/route1/route2/route3', icon: 'counter_3', tooltip: 'Route 3' },
    { label: 'Route 4', route: '/root/route1/route2/route3/route4', icon: 'counter_4', tooltip: 'Route 4' },
  ];

  readonly breadcrumbSet5: HzBreadcrumbItem[] = [
    { label: 'Root', route: '/root', icon: 'line_start_circle', tooltip: 'Root' },
    { label: 'Route 1', route: '/root/route1', icon: 'counter_1', tooltip: 'Route 1', disabled: true },
    { label: 'Route 2', route: '/root/route1/route2', icon: 'counter_2', tooltip: 'Route 2', disabled: true },
    { label: 'Route 3', route: '/root/route1/route2/route3', icon: 'counter_3', tooltip: 'Route 3' },
    { label: 'Route 4', route: '/root/route1/route2/route3/route4', icon: 'counter_4', tooltip: 'Route 4' },
  ];

  onClickChip(text: string) {
    this.snackbar.open(`Chip Clicked: ${text}`, 'Close', { duration: SNACKBAR_INTERVAL.NORMAL });
  }

  onCloseChip(text: string) {
    this.snackbar.open(`Chip Closed: ${text}`, 'Close', { duration: SNACKBAR_INTERVAL.NORMAL });
  }
}
