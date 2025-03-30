import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { BasePreset, ConvertBase } from './base-converter';
import { MatSnackBar } from '@angular/material/snack-bar';
import { moveItemInArray } from '@angular/cdk/drag-drop';

@Injectable({
  providedIn: 'root',
})
export class BaseConverterService {
  private snackbar = inject(MatSnackBar);

  private _baseConversions = signal<ConvertBase[]>(this.loadBaseConversions());
  readonly baseConversions = this._baseConversions.asReadonly();

  readonly bases = computed(() => this.baseConversions().map((item) => item.base));
  readonly usedBases = computed(() => new Set());

  constructor() {
    effect(() => this.saveBaseConversions());
  }

  saveBaseConversions() {
    localStorage.setItem('baseConversions', JSON.stringify(this._baseConversions()));
  }

  loadBaseConversions() {
    const baseConversions = localStorage.getItem('baseConversions');
    return baseConversions ? JSON.parse(baseConversions) : [];
  }

  addBase(base: number, conversions: number[]) {
    try {
      const newBase: ConvertBase = { base, conversions };
      this._baseConversions.set([...this.baseConversions(), newBase]);
      this.snackbar.open(`Successfully added Base ${base} tile`, 'Close', { duration: 3000 });
    } catch {
      this.snackbar.open(`Failed to add Base ${base} tile`, 'Close', { duration: 3000 });
    }
  }

  removeBase(base: number) {
    try {
      this._baseConversions.set([...this.baseConversions().filter((baseConversion) => baseConversion.base !== base)]);
      this.snackbar.open(`Successfully removed Base ${base} tile`, 'Close', { duration: 3000 });
    } catch {
      this.snackbar.open(`Failed to remove Base ${base} tile`, 'Close', { duration: 3000 });
    }
  }

  removeAllBases() {
    try {
      this._baseConversions.set([]);
      this.snackbar.open('Successfully removed all base tiles', 'Close', { duration: 3000 });
    } catch {
      this.snackbar.open('Failed to remove all base tiles', 'Close', { duration: 3000 });
    }
  }

  updateConversions(base: number, conversions: number[]) {
    try {
      const convertBaseCopy = this._baseConversions().map((item) => ({
        base: item.base,
        conversions: item.base === base ? [...conversions] : [...item.conversions],
      }));

      this._baseConversions.set(convertBaseCopy);
      this.snackbar.open('Successfully updated base conversions', 'Close', { duration: 3000 });
    } catch {
      this.snackbar.open('Failed to update base conversions', 'Close', { duration: 3000 });
    }
  }

  reorderConversions(reorderBase: number, prevIndex: number, currentIndex: number) {
    try {
      const convertBaseCopy = this._baseConversions().map((item) => {
        const base = item.base;
        const conversions = item.base === base ? [...item.conversions] : [...item.conversions];

        if (reorderBase === base) {
          moveItemInArray(conversions, prevIndex, currentIndex);
        }

        return {
          base,
          conversions,
        };
      });

      this._baseConversions.set(convertBaseCopy);
    } catch {}
  }
}
