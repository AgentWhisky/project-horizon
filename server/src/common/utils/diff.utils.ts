import { ChangeDiff } from '../model';

/**
 * Function to compare two given unknown items and return if they are identical
 * @param a Item to compare
 * @param b Item to compare
 * @returns Whether item a and b are identical
 */
function deepEqual(a: any, b: any): boolean {
  if (a == null && b == null) {
    return true;
  }

  if (a === b) {
    return true;
  }

  if (typeof a !== typeof b) {
    return false;
  }

  if (a && b && typeof a === 'object') {
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    if (aKeys.length !== bKeys.length) {
      return false;
    }

    return aKeys.every((k) => deepEqual(a[k], b[k]));
  }

  return false;
}

/**
 * Functionto generate a ChangeDiff object that shows the changes between a given before and after object
 * @param before The object state before the changes
 * @param after The object state after the changes
 * @returns A ChangeDiff object of changes
 */
export function generateChangeDiff<T extends object>(before: T | null, after: T): ChangeDiff {
  const diff: ChangeDiff = {};

  // Get set of keys in before and after objects
  const keys = new Set<string>([...Object.keys(before ?? {}), ...Object.keys(after ?? {})]);

  for (const key of keys) {
    const beforeVal = before ? (before as any)[key] : undefined;
    const afterVal = after ? (after as any)[key] : undefined;

    if (!deepEqual(beforeVal, afterVal)) {
      diff[key] = {
        before: beforeVal ?? null,
        after: afterVal ?? null,
      };
    }
  }

  return diff;
}
