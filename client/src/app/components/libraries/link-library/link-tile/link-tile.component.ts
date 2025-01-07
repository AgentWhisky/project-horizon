import { Component, input, signal } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

import { Link } from '../../../../types/link-library';

@Component({
  selector: 'app-link-tile',
  imports: [MatButtonModule, MatIconModule, MatChipsModule],
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

  onToggleView() {
    this.isOpen.set(!this.isOpen());
  }
}
