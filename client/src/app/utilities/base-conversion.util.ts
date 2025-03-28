/**
 * Function to convert a given string from one numeric base to another
 * @param fromBase The original base
 * @param toBase The base to convert to
 * @param value The value to convert
 * @returns 'NAN' on failure, empty string on no value provided, or the converted value on success
 */
export function convertToBase(fromBase: number, toBase: number, value: string): string {
  try {
    if (!value) {
      return '';
    }

    const convertedVal = [...value].reduce((acc, curr) => BigInt(parseInt(curr, fromBase)) + BigInt(fromBase) * acc, 0n);
    return convertedVal.toString(toBase).toUpperCase();
  } catch {
    return 'NAN';
  }
}

export const baseNames: Record<number, string> = {
  2: 'Binary',
  3: 'Ternary',
  4: 'Quaternary',
  5: 'Quinary',
  6: 'Senary',
  7: 'Septenary',
  8: 'Octal',
  9: 'Nonary',
  10: 'Decimal',
  11: 'Undecimal',
  12: 'Duodecimal',
  16: 'Hexadecimal',
  20: 'Vigesimal',
  26: 'Hexavigesimal',
  32: 'Duotrigesimal',
  36: 'Hexatrigesimal',
};
