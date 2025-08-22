import { LEXO_RANK_MINOR, REBASE_REQUIRED } from '@hz/constants';

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
    return `${newMajor}:${LEXO_RANK_MINOR.BASE}`;
  }

  // First Sort Key
  if (!prevKey && nextKey) {
    const { minor: nextMinor } = parseSortKey(nextKey);
    const nextVal = base36ToInt(nextMinor);
    const prevVal = nextVal - LEXO_RANK_MINOR.STEP;

    if (prevVal < base36ToInt(LEXO_RANK_MINOR.MIN)) {
      console.warn(`New Minor is below MINOR MIN. Require rebasing.`);
      return REBASE_REQUIRED;
    }

    const newMinor = intToBase36(prevVal, LEXO_RANK_MINOR.LENGTH);
    return `${newMajor}:${newMinor}`;
  }

  // Last Sort Key
  if (prevKey && !nextKey) {
    const { minor: prevMinor } = parseSortKey(prevKey);
    const prevVal = base36ToInt(prevMinor);
    const nextVal = prevVal + LEXO_RANK_MINOR.STEP;

    if (nextVal > base36ToInt(LEXO_RANK_MINOR.MAX)) {
      console.warn(`New Minor exceeds MINOR MAX. Require rebasing.`);
      return REBASE_REQUIRED;
    }

    const newMinor = intToBase36(nextVal, LEXO_RANK_MINOR.LENGTH);
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
    const newMinor = intToBase36(midVal, LEXO_RANK_MINOR.LENGTH);
    return `${newMajor}:${newMinor}`;
  }

  return 'INVALID';
}
