import { Component, input } from '@angular/core';
import { StatusBannerAlign, StatusBannerType } from './status-banner';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'hz-status-banner',
  imports: [MatIconModule, CommonModule],
  templateUrl: './status-banner.component.html',
  styleUrl: './status-banner.component.scss',
})
export class StatusBannerComponent {
  readonly type = input<StatusBannerType>('info');
  readonly align = input<StatusBannerAlign>('start');
  readonly message = input.required<string>();
}
