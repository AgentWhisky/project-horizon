import { Component, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ASSET_URLS } from '@hz/core/constants';
import { ImageFallbackDirective } from '@hz/core/directives';
import { ThemeService } from '@hz/core/services';
import { HzExpandDirective } from '@hz/shared/animations';

import { Link } from '../../resources/link-library.model';

@Component({
  selector: 'hz-link-tile',
  imports: [MatButtonModule, MatIconModule, MatChipsModule, MatTooltipModule, CommonModule, ImageFallbackDirective, HzExpandDirective],
  templateUrl: './link-tile.component.html',
  styleUrl: './link-tile.component.scss',
})
export class LinkTileComponent {
  readonly themeService = inject(ThemeService);

  readonly link = input.required<Link>();
  readonly isOpen = signal(false);
  readonly faviconStage = signal<number>(0);

  readonly isDarkTheme = this.themeService.isDarkTheme;

  readonly fallbackIcon = ASSET_URLS.DEFAULT_ICON;

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
