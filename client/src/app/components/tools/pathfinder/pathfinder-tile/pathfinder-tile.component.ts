import { Component, input, viewChild } from '@angular/core';
import { Tile } from '../pathfinder';

import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-pathfinder-tile',
  imports: [MatIconModule, MatMenuModule],
  templateUrl: './pathfinder-tile.component.html',
  styleUrl: './pathfinder-tile.component.scss',
})
export class PathfinderTileComponent {
  readonly tile = input.required<Tile>();

  readonly menuTrigger = viewChild.required(MatMenuTrigger);
  contextMenuPosition = { x: '0px', y: '0px' };

  onClick(event: MouseEvent) {
    event.stopImmediatePropagation();
    event.preventDefault();
  }

  onRightClick(event: MouseEvent) {
    event.preventDefault();

    this.menuTrigger().openMenu();
  }
}
