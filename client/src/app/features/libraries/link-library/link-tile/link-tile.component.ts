import { Component, inject, input, signal } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Link } from '../link-library';
import { CommonModule } from '@angular/common';

import { ImageFallbackDirective } from '@hz/core/directives';
import { ThemeService } from '@hz/core/services';

@Component({
  selector: 'hz-link-tile',
  imports: [MatButtonModule, MatIconModule, MatChipsModule, MatTooltipModule, CommonModule, ImageFallbackDirective],
  templateUrl: './link-tile.component.html',
  styleUrl: './link-tile.component.scss',
  animations: [
    trigger('expand', [
      transition(':enter', [style({ height: '0' }), animate('0.2s ease-out', style({ height: '*' }))]),
      transition(':leave', [animate('0.2s ease-in', style({ height: '0' }))]),
    ]),
  ],
})
export class LinkTileComponent {
  readonly themeService = inject(ThemeService);

  readonly link = input.required<Link>();
  readonly isOpen = signal(false);

  readonly faviconStage = signal<number>(0);

  readonly isDarkTheme = this.themeService.isDarkTheme;

  onToggleView() {
    this.isOpen.set(!this.isOpen());
  }

  onOpenView() {
    this.isOpen.set(true);
  }

  onCloseView() {
    this.isOpen.set(false);
  }
}
