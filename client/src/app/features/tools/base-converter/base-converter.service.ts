import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { moveItemInArray } from '@angular/cdk/drag-drop';

import { MatSnackBar } from '@angular/material/snack-bar';

import { STORAGE_KEYS } from '@hz/core/constants';

import { ConvertBase } from './base-converter';

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
    localStorage.setItem(STORAGE_KEYS.BASE_CONVERTER.CONVERSIONS, JSON.stringify(this._baseConversions()));
  }

  loadBaseConversions(): ConvertBase[] {
    const baseConversions = localStorage.getItem(STORAGE_KEYS.BASE_CONVERTER.CONVERSIONS);
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
