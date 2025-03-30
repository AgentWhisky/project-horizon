export interface BasePreset {
  name: string;
  baseConversions: ConvertBase[];
}

export interface ConvertBase {
  base: number;
  conversions: number[];
}

export interface ReorderConversion {
  base: number;
  prevIndex: number;
  currentIndex: number;
}
