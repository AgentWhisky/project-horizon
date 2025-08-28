import { Component, signal } from '@angular/core';
import { BannerType, HzBannerModule } from '@hz/shared/components';

@Component({
  selector: 'hz-test-banner',
  imports: [HzBannerModule],
  templateUrl: './test-banner.component.html',
  styleUrl: './test-banner.component.scss',
})
export class TestBannerComponent {
  readonly bannerTypes = signal<BannerType[]>(['success', 'warning', 'error', 'base']);
}
