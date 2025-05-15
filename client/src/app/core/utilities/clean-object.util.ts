/**
 * Removes properties from an object that have `undefined` or `null` values.
 * @param input - The object to filter.
 * @returns A new object with all `undefined` and `null` values removed.
 */
export function cleanObject<T extends Record<string, any>>(input?: T): Partial<T> {
  if (!input) return {};

  return Object.fromEntries(Object.entries(input).filter(([, value]) => value !== undefined && value !== null)) as Partial<T>;
}
