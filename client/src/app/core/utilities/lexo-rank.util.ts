const ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyz';
const BASE = ALPHABET.length;
const PAD_LENGTH = 8;

export function generateSortKeyBetween(before?: string, after?: string): string {
  const min = 0;
  const max = Math.pow(BASE, PAD_LENGTH) - 1;

  const beforeVal = before ? parseInt(before, 36) : min;
  const afterVal = after ? parseInt(after, 36) : max;

  const newVal = Math.floor((beforeVal + afterVal) / 2);

  return newVal.toString(36).padStart(PAD_LENGTH, '0');
}
