/**
 * Removes properties from an object that have `undefined`, `null`, or empty string values.
 * @param input - The object to filter.
 * @returns A new object with all `undefined`, `null`, and empty string values removed.
 */
export function cleanObject<T extends Record<string, any>>(input?: T): Partial<T> {
  if (!input) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(input).filter(([, value]) => value !== undefined && value !== null && value !== '')
  ) as Partial<T>;
}
