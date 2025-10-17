import { CommonModule } from '@angular/common';
import { AfterViewInit, booleanAttribute, Component, ElementRef, inject, input, output } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

import { HzStatusType } from '@hz/core/models';
import { FocusMonitor } from '@angular/cdk/a11y';

@Component({
  selector: 'hz-chip',
  imports: [RouterModule, CommonModule, MatButtonModule, MatIconModule, MatRippleModule, CommonModule],
  templateUrl: './hz-chip.component.html',
  styleUrl: './hz-chip.component.scss',
})
export class HzChipComponent implements AfterViewInit {
  readonly type = input<HzStatusType>('base');

  readonly clickable = input(false, { transform: booleanAttribute });
  readonly closeable = input(false, { transform: booleanAttribute });

  readonly clicked = output<void>(); // Emit a click event to be used by parent
  readonly closed = output<void>(); // Emit a closed event to be used by parent

  readonly routerLink = input<string | any[] | null>(null);
  readonly href = input<string | null>(null);

  private _el = inject(ElementRef<HTMLElement>);
  private _focusMonitor = inject(FocusMonitor);

  ngAfterViewInit(): void {
    /**
     * Force host to have tabindex = -1 even if overwritten
     */
    queueMicrotask(() => {
      this._focusMonitor.stopMonitoring(this._el.nativeElement);
      this._el.nativeElement.tabIndex = -1;
    });
  }

  onClick() {
    this.clicked.emit();
  }

  onClose(event: MouseEvent) {
    event.preventDefault();
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
