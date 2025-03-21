import { Injectable, signal } from '@angular/core';
import { BasePreset, ConvertBase } from './base-converter';

@Injectable({
  providedIn: 'root',
})
export class BaseConverterService {
  private _basePresets = signal<BasePreset[]>(presets);
  readonly basePresets = this._basePresets.asReadonly();

  constructor() {}

  addBase(base: number) {}

  removeBase(base: number) {}

  addConversion(base: number, conversion: number) {}

  removeConversion(base: number, conversion: number) {}
}

// TEMP DATA
const preset1: BasePreset = {
  name: 'Preset 1',
  baseConversions: [
    { base: 10, conversions: [16, 8, 2] },
    { base: 16, conversions: [10, 8, 2] },
    { base: 8, conversions: [10, 16, 2] },
    { base: 2, conversions: [10, 16, 8] },
  ],
};

const preset2: BasePreset = {
  name: 'Preset 2',
  baseConversions: [
    { base: 10, conversions: [16, 8] },
    { base: 16, conversions: [10, 8, 2] },
    { base: 2, conversions: [10] },
  ],
};

const preset3: BasePreset = {
  name: 'Preset 3',
  baseConversions: [
    { base: 10, conversions: [16, 8] },
    { base: 16, conversions: [10, 8, 2] },
  ],
};

const presets = [preset1, preset2, preset3];
