import { Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { BannerType, HzBannerModule } from '@hz/shared/components';

@Component({
  selector: 'hz-test-banner',
  imports: [MatButtonModule, MatIconModule, RouterModule, HzBannerModule],
  templateUrl: './test-banner.component.html',
  styleUrl: './test-banner.component.scss',
})
export class TestBannerComponent {
  readonly bannerTypes = signal<BannerType[]>(['success', 'warning', 'error', 'base']);
}
