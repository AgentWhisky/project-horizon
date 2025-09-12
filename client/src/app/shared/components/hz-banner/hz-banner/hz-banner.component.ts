import { booleanAttribute, Component, computed, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HzStatusType } from '@hz/core/models';

@Component({
  selector: 'hz-banner',
  imports: [MatButtonModule, MatIconModule, CommonModule],
  templateUrl: './hz-banner.component.html',
  styleUrl: './hz-banner.component.scss',
})
export class HzBannerComponent {
  readonly type = input<HzStatusType>('base');
  readonly displayIcon = input<string | null>(null);
  readonly closeable = input(false, { transform: booleanAttribute });
  readonly closeDisabled = input(false, { transform: booleanAttribute });

  readonly closed = output<void>(); // Emit an event to be used by parent

  readonly icon = computed(() => {
    if (this.displayIcon()) {
      return this.displayIcon() ?? 'info_outline';
    }

    switch (this.type()) {
      case 'base':
        return 'info_outline';
      case 'primary':
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
    this.closed.emit();
    this.isClosed.set(true);
  }
}
