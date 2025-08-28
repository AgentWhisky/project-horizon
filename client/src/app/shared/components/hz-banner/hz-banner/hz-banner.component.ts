import { booleanAttribute, Component, computed, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { BannerType } from '../hz-banner.model';

@Component({
  selector: 'hz-banner',
  imports: [MatButtonModule, MatIconModule, CommonModule],
  templateUrl: './hz-banner.component.html',
  styleUrl: './hz-banner.component.scss',
})
export class HzBannerComponent {
  readonly type = input<BannerType>('base');
  readonly displayIcon = input<string | null>(null);
  readonly closeable = input(false, { transform: booleanAttribute });
  readonly closeDisabled = input(false, { transform: booleanAttribute });

  readonly icon = computed(() => {
    if (this.displayIcon()) {
      return this.displayIcon() ?? '';
    }

    switch (this.type()) {
      case 'base':
        return 'info_outline';
      case 'success':
        return 'check_circle_outline';
      case 'warning':
        return 'warning_amber';
      case 'error':
        return 'error_outline';
      default:
        return '';
    }
  });
  readonly isClosed = signal<boolean>(false);

  onClose() {
    this.isClosed.set(true);
  }
}
