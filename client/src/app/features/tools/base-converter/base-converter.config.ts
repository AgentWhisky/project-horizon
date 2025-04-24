import { BasePattern } from './base-converter';

export const BASE_CHAR_PATTERNS: Record<number, BasePattern> = {
  2: { regex: /^[01]*$/, displayText: '0-1' },
  3: { regex: /^[0-2]*$/, displayText: '0-2' },
  4: { regex: /^[0-3]*$/, displayText: '0-3' },
  5: { regex: /^[0-4]*$/, displayText: '0-4' },
  6: { regex: /^[0-5]*$/, displayText: '0-5' },
  7: { regex: /^[0-6]*$/, displayText: '0-6' },
  8: { regex: /^[0-7]*$/, displayText: '0-7' },
  9: { regex: /^[0-8]*$/, displayText: '0-8' },
  10: { regex: /^[0-9]*$/, displayText: '0-9' },
  11: { regex: /^[0-9A]*$/, displayText: '0-9, A' },
  12: { regex: /^[0-9A-B]*$/, displayText: '0-9, A-B' },
  16: { regex: /^[0-9A-F]*$/, displayText: '0-9, A-F' },
  20: { regex: /^[0-9A-J]*$/, displayText: '0-9, A-J' },
  26: { regex: /^[A-Z]*$/, displayText: 'A-Z' },
  32: { regex: /^[0-9A-V]*$/, displayText: '0-9, A-V' },
  36: { regex: /^[0-9A-Z]*$/, displayText: '0-9, A-Z' },
};

export const baseNames: Record<number, string> = {
  2: 'Binary',
  8: 'Octal',
  10: 'Decimal',
  16: 'Hexadecimal',
};

export const defaultNumericBases: number[] = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 16, 20, 26, 32, 36];
