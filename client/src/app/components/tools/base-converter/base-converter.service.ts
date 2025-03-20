import { Injectable, signal } from '@angular/core';
import { ConvertBase } from './base-converter';

@Injectable({
  providedIn: 'root',
})
export class BaseConverterService {
  private _bases = signal<ConvertBase[]>(convertBases);
  readonly bases = this._bases.asReadonly();

  constructor() {}

  addBaseConversion() {

  }

  removeBase(base: number) {
    console.log('REMOVE', base);
  }
}

const convertBases: ConvertBase[] = [
  { base: 10, conversions: [16, 8, 2] },
  { base: 16, conversions: [10, 8, 2] },
  { base: 8, conversions: [10, 16, 2] },
  { base: 2, conversions: [10, 16, 8] },
];
