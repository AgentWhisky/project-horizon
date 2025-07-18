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

  onFaviconError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/favicon.png';
  }
}
