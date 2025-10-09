import { Component, inject, input, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { DurationPipe, FormatDatePipe } from '@hz/core/pipes';
import {
  HzBannerModule,
  HzBreadcrumbItem,
  HzBreadcrumbModule,
  HzCardModule,
  HzLoadingSpinnerModule,
  HzTimelineModule,
} from '@hz/shared/components';

import { UpdateOverviewService } from './update-overview.service';
import { UpdateStatusPipe, UpdateStatusTypePipe, UpdateTypePipe } from '../resources/steam-insight-management.pipe';

@Component({
  selector: 'hz-update-overview',
  imports: [
    MatProgressSpinnerModule,
    HzBreadcrumbModule,
    HzCardModule,
    HzTimelineModule,
    HzBannerModule,
    HzLoadingSpinnerModule,
    DatePipe,
    DurationPipe,
    FormatDatePipe,
    UpdateTypePipe,
    UpdateStatusPipe,
    UpdateStatusTypePipe,
  ],
  templateUrl: './update-overview.component.html',
  styleUrl: './update-overview.component.scss',
})
export class UpdateOverviewComponent implements OnInit {
  readonly id = input.required<number>();

  private readonly updateOverviewService = inject(UpdateOverviewService);

  readonly steamInsightUpdate = this.updateOverviewService.update;
  readonly loadingState = this.updateOverviewService.loadingState;

  readonly breadcrumbItems: HzBreadcrumbItem[] = [
    { label: 'Administration', route: '/administration', icon: 'admin_panel_settings' },
    { label: 'Steam Insight Management', route: '/administration/steam-insight-management', svgIcon: 'steam' },
    { label: 'Update Overview' },
  ];

  ngOnInit() {
    this.updateOverviewService.loadUpdate(this.id());
  }
}
