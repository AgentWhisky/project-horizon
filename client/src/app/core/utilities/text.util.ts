/**
 * Gives a rough estimate of the syllables in a given word
 *
 * @param word The given word to calculate syllables for
 */
export function countSyllables(word: string): number {
  if (word.length <= 3) return 1;

  // Remove trailing 'e'
  const clean = word.replace(/(?:e$)/, '');

  // Count vowel groups
  const syllableGroups = clean.match(/[aeiouy]{1,2}/g);
  let count = syllableGroups ? syllableGroups.length : 0;

  // Handle special cases
  if (word.endsWith('le') && !/[aeiou]le$/.test(word)) {
    count += 1;
  }

  return count > 0 ? count : 1;
}
