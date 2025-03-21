export interface BasePreset {
  name: string;
  baseConversions: ConvertBase[];
}

export interface ConvertBase {
  base: number;
  conversions: number[];
}
