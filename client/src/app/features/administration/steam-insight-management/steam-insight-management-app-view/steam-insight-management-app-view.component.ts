import { Component, inject, input, OnInit } from '@angular/core';
import { SteamInsightManagementAppViewService } from './resources/steam-insight-management-app-view.service';
import { DatePipe, JsonPipe, TitleCasePipe } from '@angular/common';

import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LOADING_STATUS } from '@hz/core/constants';
import { HzBannerModule, HzBreadcrumbItem, HzBreadcrumbModule, HzCardModule } from '@hz/shared/components';

@Component({
  selector: 'hz-steam-insight-management-app-view',
  imports: [
    MatExpansionModule,
    MatProgressSpinnerModule,
    HzBannerModule,
    HzCardModule,
    HzBreadcrumbModule,
    JsonPipe,
    DatePipe,
    TitleCasePipe,
  ],
  templateUrl: './steam-insight-management-app-view.component.html',
  styleUrl: './steam-insight-management-app-view.component.scss',
})
export class SteamInsightManagementAppViewComponent implements OnInit {
  private steamInsightManagementAppViewService = inject(SteamInsightManagementAppViewService);

  readonly appid = input.required<number>();

  readonly breadcrumbItems: HzBreadcrumbItem[] = [
    { label: 'Administration', route: '/administration', icon: 'admin_panel_settings' },
    { label: 'Steam Insight Management', route: '/administration/steam-insight-management', svgIcon: 'steam' },
    { label: 'App Overview' },
  ];

  readonly appRaw = this.steamInsightManagementAppViewService.appRaw;
  readonly appRawLoadingStatus = this.steamInsightManagementAppViewService.appRawLoadingStatus;
  readonly LOADING_STATUS = LOADING_STATUS;

  ngOnInit() {
    this.steamInsightManagementAppViewService.loadAppRaw(this.appid());
  }
}
