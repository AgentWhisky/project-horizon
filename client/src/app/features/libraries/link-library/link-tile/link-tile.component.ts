import { Component, input, signal } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Link } from '../link-library';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'hz-link-tile',
  imports: [MatButtonModule, MatIconModule, MatChipsModule, MatTooltipModule, CommonModule],
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
  readonly link = input.required<Link>();
  readonly isOpen = signal(false);

  readonly faviconStage = signal<number>(0);

  onToggleView() {
    this.isOpen.set(!this.isOpen());
  }

  onOpenView() {
    this.isOpen.set(true);
  }

  onCloseView() {
    this.isOpen.set(false);
  }

  getFavicon(url: string, stage: number): string {
    const domain = new URL(url).hostname;

    switch (stage) {
      case 0:
        return `${new URL(url).origin}/favicon.ico`;
      case 1:
        return `https://www.google.com/s2/favicons?domain=${domain}`;
      case 2:
        return `https://icons.duckduckgo.com/ip3/${domain}.ico`;
      default:
        return 'assets/favicon.png';
    }
  }

  onFaviconError(url: string): void {
    if (this.faviconStage() < 2) {
      this.faviconStage.set(this.faviconStage() + 1);
    }
  }
}
