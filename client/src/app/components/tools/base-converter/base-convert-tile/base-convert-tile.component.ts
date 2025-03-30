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
import { BaseInputRestrictDirective } from '../../../../directives/base-input-restrict.directive';

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
    BaseInputRestrictDirective,
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
    const conversionMap = new Map<number, string>();
    const fromBase = this.convertBase().base;
    const toBases = this.convertBase().conversions;
    const value = this.convertInput();

    toBases.forEach((toBase) => conversionMap.set(toBase, convertToBase(fromBase, toBase, value)));

    return conversionMap;
  }
}
