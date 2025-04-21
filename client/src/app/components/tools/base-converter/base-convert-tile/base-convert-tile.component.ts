import { Component, computed, input, model, output } from '@angular/core';
import { CdkDragDrop, CdkDropList, CdkDrag } from '@angular/cdk/drag-drop';

import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { ConvertBase, ReorderConversion } from '../base-converter';
import { baseNames, convertToBase } from '../../../../utilities/base-conversion.util';
import { UppercaseDirective } from '../../../../directives/uppercase.directive';

@Component({
  selector: 'app-base-convert-tile',
  imports: [
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatDividerModule,
    MatTooltipModule,
    FormsModule,
    CdkDropList,
    CdkDrag,
    UppercaseDirective,
  ],
  templateUrl: './base-convert-tile.component.html',
  styleUrl: './base-convert-tile.component.scss',
})
export class BaseConvertTileComponent {
  readonly convertBase = input.required<ConvertBase>();
  readonly convertInput = model<string>('');

  readonly updateConversions = output<number>();
  readonly removeTile = output<number>();
  readonly reorderConversions = output<ReorderConversion>();
  readonly conversionMap = computed(() => this.convert());

  readonly baseNames = baseNames;

  onUpdateConversions() {
    this.updateConversions.emit(this.convertBase().base);
  }

  onRemoveBase() {
    this.removeTile.emit(this.convertBase().base);
  }

  onDrop(event: CdkDragDrop<number[]>) {
    this.reorderConversions.emit({ base: this.convertBase().base, prevIndex: event.previousIndex, currentIndex: event.currentIndex });
  }

  convert() {
    const value = this.convertInput();

    const conversionMap = new Map<number, string>();
    const fromBase = this.convertBase().base;
    const toBases = this.convertBase().conversions;

    toBases.forEach((toBase) => conversionMap.set(toBase, convertToBase(fromBase, toBase, value)));

    return conversionMap;
  }

  getPattern() {
    return baseCharMap[this.convertBase().base];
  }
}

const baseCharMap: Record<number, RegExp> = {
  2: /^[01]$/,
  3: /^[0-2]$/,
  4: /^[0-3]$/,
  5: /^[0-4]$/,
  6: /^[0-5]$/,
  7: /^[0-6]$/,
  8: /^[0-7]$/,
  9: /^[0-8]$/,
  10: /^[0-9]$/,
  11: /^[0-9A]$/,
  12: /^[0-9A-B]$/,
  16: /^[0-9A-F]$/,
  20: /^[0-9A-J]$/,
  26: /^[A-Z]$/,
  32: /^[0-9A-V]$/,
  36: /^[0-9A-Z]$/,
};
