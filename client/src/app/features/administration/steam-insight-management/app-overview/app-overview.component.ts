import { Component, inject, input, OnInit } from '@angular/core';
import { DatePipe, JsonPipe, TitleCasePipe } from '@angular/common';

import { MatExpansionModule } from '@angular/material/expansion';

import { HzBannerModule, HzBreadcrumbItem, HzBreadcrumbModule, HzCardModule, HzLoadingSpinnerModule } from '@hz/shared/components';

import { AppOverviewService } from './app-overview.service';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'hz-app-overview',
  imports: [
    MatTabsModule,
    MatExpansionModule,
    HzBreadcrumbModule,
    HzBannerModule,
    HzCardModule,
    HzLoadingSpinnerModule,
    TitleCasePipe,
    DatePipe,
    JsonPipe,
  ],
  templateUrl: './app-overview.component.html',
  styleUrl: './app-overview.component.scss',
})
export class AppOverviewComponent implements OnInit {
  readonly appid = input.required<number>();

  private readonly appOverviewService = inject(AppOverviewService);

  readonly steamInsightApp = this.appOverviewService.app;
  readonly loadingState = this.appOverviewService.loadingState;

  readonly breadcrumbItems: HzBreadcrumbItem[] = [
    { label: 'Administration', route: '/administration', icon: 'admin_panel_settings' },
    { label: 'Steam Insight Management', route: '/administration/steam-insight-management', svgIcon: 'steam' },
    { label: 'App Overview' },
  ];

  ngOnInit() {
    this.appOverviewService.loadApp(this.appid());
  }

  ngOnDestroy() {
    this.appOverviewService.clearApp();
  }

  onAppActiveUpdate() {
    this.appOverviewService.toggleAppActive();
  }
}
