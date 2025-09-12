import { CommonModule } from '@angular/common';
import { booleanAttribute, Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

import { HzStatusType } from '@hz/core/models';

@Component({
  selector: 'hz-chip',
  imports: [MatButtonModule, MatIconModule, MatRippleModule, CommonModule],
  templateUrl: './hz-chip.component.html',
  styleUrl: './hz-chip.component.scss',
})
export class HzChipComponent {
  readonly type = input<HzStatusType>('base');

  readonly clickable = input(false, { transform: booleanAttribute });
  readonly closeable = input(false, { transform: booleanAttribute });

  readonly clicked = output<void>(); // Emit a click event to be used by parent
  readonly closed = output<void>(); // Emit a closed event to be used by parent

  onClick() {
    this.clicked.emit();
  }

  onClose(event: MouseEvent) {
    event.stopPropagation();
    this.closed.emit();
  }

  get rippleColor(): string {
    switch (this.type()) {
      case 'success':
        return 'var(--hz-sys-success-ripple)';
      case 'warning':
        return 'var(--hz-sys-warning-ripple)';
      case 'error':
        return 'var(--hz-sys-error-ripple)';
      default:
        return 'var(--hz-sys-base-ripple)';
    }
  }
}
