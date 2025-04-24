import { ChangeDetectionStrategy, Component, computed, effect, HostListener, inject, OnInit, signal } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { PathfinderCreateDialogComponent } from './pathfinder-create-dialog/pathfinder-create-dialog.component';
import { filter, tap } from 'rxjs';
import { PathfinderService } from './pathfinder.service';
import { PathfinderTileComponent } from './pathfinder-tile/pathfinder-tile.component';
import { Tile } from './pathfinder';

const minTileSize = 12;
const maxTileSize = 32;

@Component({
  selector: 'app-pathfinder',
  imports: [MatButtonModule, MatIconModule, PathfinderTileComponent],
  templateUrl: './pathfinder.component.html',
  styleUrl: './pathfinder.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PathfinderComponent {
  private pathfinderService = inject(PathfinderService);
  private dialog = inject(MatDialog);

  readonly board = this.pathfinderService.board;
  readonly hasBoard = this.pathfinderService.hasBoard;
  readonly boardRows = this.pathfinderService.boardRows;
  readonly boardCols = this.pathfinderService.boardCols;

  readonly boardZoom = signal<number>(1);
  readonly tileSize = computed(() => this.calculateTileSize() * this.boardZoom());

  constructor() {
    effect(() => console.log(this.boardZoom()));
  }

  onCreateBoard() {
    this.dialog
      .open(PathfinderCreateDialogComponent, { width: '560px' })
      .afterClosed()
      .pipe(
        filter((result) => result && result.status),
        tap((result) => this.pathfinderService.createBoard(result.rows, result.columns))
      )
      .subscribe();
  }

  onSave() {}

  onLoad() {}

  columnTrack(tile: Tile) {
    return `${tile.row}-${tile.column}`;
  }

  onScroll(event: WheelEvent) {
    event.preventDefault();
    const delta = -event.deltaY;
    const zoomSpeed = 0.001;
    const newZoom = Math.min(Math.max(this.boardZoom() + delta * zoomSpeed, 0.1), 2.5);

    const newZoomRounded = Math.round(newZoom * 100) / 100;

    this.boardZoom.set(newZoomRounded);
  }

  private lastPinchDistance: number | null = null;

  onTouchStart(event: TouchEvent): void {
    if (event.touches.length === 2) {
      this.lastPinchDistance = this.getDistance(event.touches[0], event.touches[1]);
    }
  }

  onTouchMove(event: TouchEvent): void {
    if (event.touches.length === 2 && this.lastPinchDistance !== null) {
      const currentDistance = this.getDistance(event.touches[0], event.touches[1]);
      const delta = currentDistance - this.lastPinchDistance;

      // Simulate a wheel delta (positive = zoom in, negative = zoom out)
      const simulatedDeltaY = -delta * 2; // pinch apart = negative deltaY = zoom in

      this.onScroll({ deltaY: simulatedDeltaY, preventDefault: () => {} } as WheelEvent);

      this.lastPinchDistance = currentDistance;
      event.preventDefault();
    }
  }

  onTouchEnd(event: TouchEvent): void {
    if (event.touches.length < 2) {
      this.lastPinchDistance = null;
    }
  }

  private getDistance(touch1: Touch, touch2: Touch): number {
    const dx = touch2.clientX - touch1.clientX;
    const dy = touch2.clientY - touch1.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  calculateTileSize(): number {
    const containerWidth = window.innerWidth; // or a fixed container width
    const containerHeight = window.innerHeight;

    const maxTileWidth = Math.floor(containerWidth / this.boardCols());
    const maxTileHeight = Math.floor(containerHeight / this.boardRows());

    // Use the smaller of the two to keep tiles square and fitting in view
    const adjustedSize = Math.min(maxTileWidth, maxTileHeight);

    // Don't make them bigger than the default
    return Math.max(minTileSize, Math.min(adjustedSize, maxTileSize));
  }
}
