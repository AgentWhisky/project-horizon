import { Component, computed, inject, input, OnInit } from '@angular/core';
import { HzBreadcrumbItem, HzBreadcrumbModule, HzCardModule, HzTimelineModule } from '@hz/shared/components';
import { UpdateOverviewService } from './update-overview.service';
import { getUpdateStatus, getUpdateStatusType, getUpdateType } from '../resources/steam-insight-management.utils';
import { HzStatusType } from '@hz/core/models';
import { DatePipe } from '@angular/common';
import { DurationPipe, FormatDatePipe } from '@hz/core/pipes';
import { CdkTableModule } from '@angular/cdk/table';
import { getRuntime } from '@hz/core/utilities';

@Component({
  selector: 'hz-update-overview',
  imports: [HzBreadcrumbModule, HzCardModule, HzTimelineModule, DatePipe, DurationPipe, FormatDatePipe, CdkTableModule],
  templateUrl: './update-overview.component.html',
  styleUrl: './update-overview.component.scss',
})
export class UpdateOverviewComponent implements OnInit {
  readonly id = input.required<number>();

  private updateOverviewService = inject(UpdateOverviewService);

  readonly update = this.updateOverviewService.update;
  readonly updateDetails = computed(() => {
    const update = this.update();

    return {
      updateType: update ? getUpdateType(update.updateType) : '',
      updateStatus: update ? getUpdateStatus(update.updateStatus) : '',
      updateStatusType: update ? getUpdateStatusType(update.updateStatus) : ('base' as HzStatusType),
      totalRuntime: update ? getRuntime(update.startTime, update?.endTime, 's') : null,
    };
  });

  readonly breadcrumbItems: HzBreadcrumbItem[] = [
    { label: 'Administration', route: '/administration', icon: 'admin_panel_settings' },
    { label: 'Steam Insight Management', route: '/administration/steam-insight-management', svgIcon: 'steam' },
    { label: 'Update Overview' },
  ];

  ngOnInit() {
    this.updateOverviewService.loadUpdate(this.id());
  }
}
