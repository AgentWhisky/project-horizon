import { Component, inject, input, OnInit } from '@angular/core';
import { SteamInsightManagementAppViewService } from './resources/steam-insight-management-app-view.service';
import { DatePipe, JsonPipe, TitleCasePipe } from '@angular/common';

import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LOADING_STATUS } from '@hz/core/constants';
import { HzBannerModule } from '@hz/shared/components';
import { HzCardModule } from '@hz/shared/components/hz-card';

@Component({
  selector: 'hz-steam-insight-management-app-view',
  imports: [MatExpansionModule, MatProgressSpinnerModule, HzBannerModule, HzCardModule, JsonPipe, DatePipe, TitleCasePipe],
  templateUrl: './steam-insight-management-app-view.component.html',
  styleUrl: './steam-insight-management-app-view.component.scss',
})
export class SteamInsightManagementAppViewComponent implements OnInit {
  private steamInsightManagementAppViewService = inject(SteamInsightManagementAppViewService);

  readonly appid = input.required<number>();

  readonly appRaw = this.steamInsightManagementAppViewService.appRaw;
  readonly appRawLoadingStatus = this.steamInsightManagementAppViewService.appRawLoadingStatus;
  readonly LOADING_STATUS = LOADING_STATUS;

  ngOnInit() {
    this.steamInsightManagementAppViewService.loadAppRaw(this.appid());
  }
}
