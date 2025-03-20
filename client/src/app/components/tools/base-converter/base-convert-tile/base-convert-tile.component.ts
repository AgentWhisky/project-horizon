import { Component, input, model, output } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { FormsModule } from '@angular/forms';
import { ConvertBase } from '../base-converter';

@Component({
  selector: 'app-base-convert-tile',
  imports: [MatInputModule, MatButtonModule, MatCardModule, MatIconModule, MatDividerModule, MatExpansionModule, FormsModule],
  templateUrl: './base-convert-tile.component.html',
  styleUrl: './base-convert-tile.component.scss',
})
export class BaseConvertTileComponent {
  readonly convertBase = input.required<ConvertBase>();
  readonly convertInput = model<string>('');

  readonly onAddTile = output<number>();
  readonly onRemoveTile = output<number>();

  onAdd() {
    this.onAddTile.emit(this.convertBase().base);
  }

  onRemove() {
    this.onRemoveTile.emit(this.convertBase().base);
  }
}
