import { MINOR_BASE, MINOR_LENGTH, MINOR_MAX, MINOR_MIN, MINOR_STEP, REBASE_REQUIRED } from '../constants/lexo-rank.constant';

function base36ToInt(value: string): number {
  return parseInt(value, 36);
}

function intToBase36(value: number, length: number): string {
  return value.toString(36).toUpperCase().padStart(length, '0');
}

function parseSortKey(sortKey: string): { major: string; minor: string } {
  const [major, minor] = sortKey.split(':');
  return { major, minor };
}

export function generateSortKey(prevKey?: string | null, nextKey?: string | null, major?: string): string {
  const newMajor = major ? major.padStart(6, '0') : '000000';

  // Only Sort Key
  if (!prevKey && !nextKey) {
    return `${newMajor}:${MINOR_BASE}`;
  }

  // First Sort Key
  if (!prevKey && nextKey) {
    const { minor: nextMinor } = parseSortKey(nextKey);
    const nextVal = base36ToInt(nextMinor);
    const prevVal = nextVal - MINOR_STEP;

    if (prevVal < base36ToInt(MINOR_MIN)) {
      console.warn(`New Minor is below MINOR MIN. Require rebasing.`);
      return REBASE_REQUIRED;
    }

    const newMinor = intToBase36(prevVal, MINOR_LENGTH);
    return `${newMajor}:${newMinor}`;
  }

  // Last Sort Key
  if (prevKey && !nextKey) {
    const { minor: prevMinor } = parseSortKey(prevKey);
    const prevVal = base36ToInt(prevMinor);
    const nextVal = prevVal + MINOR_STEP;

    if (nextVal > base36ToInt(MINOR_MAX)) {
      console.warn(`New Minor exceeds MINOR MAX. Require rebasing.`);
      return REBASE_REQUIRED;
    }

    const newMinor = intToBase36(nextVal, MINOR_LENGTH);
    return `${newMajor}:${newMinor}`;
  }

  // Between Sort Key
  if (prevKey && nextKey) {
    const { minor: prevMinor } = parseSortKey(prevKey);
    const { minor: nextMinor } = parseSortKey(nextKey);

    const prevVal = base36ToInt(prevMinor);
    const nextVal = base36ToInt(nextMinor);

    if (nextVal - prevVal <= 1) {
      console.warn(`No room between ranks ${prevKey} and ${nextKey}. Require rebasing.`);
      return REBASE_REQUIRED;
    }

    const midVal = Math.floor((prevVal + nextVal) / 2);
    const newMinor = intToBase36(midVal, MINOR_LENGTH);
    return `${newMajor}:${newMinor}`;
  }

  return 'INVALID';
}
