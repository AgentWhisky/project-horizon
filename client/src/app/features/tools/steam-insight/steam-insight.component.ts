import { Component } from '@angular/core';
import { StatusBannerComponent } from '../../../shared/components/status-banner/status-banner.component';

@Component({
  selector: 'hz-steam-insight',
  imports: [StatusBannerComponent],
  templateUrl: './steam-insight.component.html',
  styleUrl: './steam-insight.component.scss',
})
export class SteamInsightComponent {}
