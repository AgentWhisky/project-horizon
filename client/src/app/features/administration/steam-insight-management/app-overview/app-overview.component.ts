import { Component, inject, input, OnInit } from '@angular/core';
import { HzBannerModule, HzBreadcrumbItem, HzBreadcrumbModule, HzCardModule } from '@hz/shared/components';
import { AppOverviewService } from './app-overview.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DatePipe, JsonPipe, TitleCasePipe } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'hz-app-overview',
  imports: [
    MatExpansionModule,
    MatProgressSpinnerModule,
    HzBreadcrumbModule,
    HzBannerModule,
    HzCardModule,
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
}
