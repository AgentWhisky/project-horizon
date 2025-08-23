/**
 * Converts a given string from one numeric base to another.
 *
 * @param fromBase The base of the input value.
 * @param toBase The base to convert the value to.
 * @param value The numeric value (as a string) to be converted.
 * @returns The converted value as a string, or:
 *   - 'NAN' if the conversion fails.
 *   - An empty string if no value is provided.
 */
export function convertToBase(fromBase: number, toBase: number, value: string): string {
  try {
    if (!value) {
      return '';
    }

    let decimalValue = 0n;

    for (const digit of value) {
      const digitValue = BigInt(parseInt(digit, fromBase));
      decimalValue = decimalValue * BigInt(fromBase) + digitValue;
    }

    return decimalValue.toString(toBase).toUpperCase();
  } catch {
    return 'NAN';
  }
}
