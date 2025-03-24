import { Component, computed, effect, input, model, output } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { ConvertBase } from '../base-converter';
import { baseNames, convertToBase } from '../../../../utilities/base-conversion.util';

@Component({
  selector: 'app-base-convert-tile',
  imports: [MatInputModule, MatButtonModule, MatCardModule, MatIconModule, MatDividerModule, MatTooltipModule, FormsModule],
  templateUrl: './base-convert-tile.component.html',
  styleUrl: './base-convert-tile.component.scss',
})
export class BaseConvertTileComponent {
  readonly convertBase = input.required<ConvertBase>();
  readonly convertInput = model<string>('');

  readonly onAddTile = output<number>();
  readonly onRemoveTile = output<number>();
  readonly conversionMap = computed(() => this.convert());

  readonly baseNames = baseNames;

  constructor() {
    effect(() => console.log(this.conversionMap()));
  }

  onAdd() {
    this.onAddTile.emit(this.convertBase().base);
  }

  onRemove() {
    this.onRemoveTile.emit(this.convertBase().base);
  }

  convert() {
    // Get Orig Base
    // Get new bases
    // Get String (Sanitize)
    // Foreach send to conversion utility function
    // Build map

    const conversionMap = new Map<number, string>();
    const fromBase = this.convertBase().base;
    const toBases = this.convertBase().conversions;
    const value = this.convertInput();

    toBases.forEach((toBase) => conversionMap.set(toBase, convertToBase(fromBase, toBase, value)));

    return conversionMap;
  }
}
