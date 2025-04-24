import { charLabels } from '../constants/text.constants';
import { CharacterBreakdown } from '../types/text.type';

/**
 * Analyzes a string and returns a breakdown of each character and how many times it appears.
 *
 * @param text - The input string to analyze.
 * @param caseSensitive - Whether to treat uppercase and lowercase letters as different characters.
 * @returns An array of CharacterBreakdown objects, each containing a character and its count.
 */
export function getCharacterCount(text: string, caseSensitive: boolean = true): CharacterBreakdown[] {
  if (!text) {
    return [];
  }

  // Check case sensitivity
  if (!caseSensitive) {
    text = text.toUpperCase();
  }

  const charCounter: Record<string, number> = {};

  for (const char of text) {

    // Check for non-visible special characters
    const key = charLabels[char] ?? char;

    if (!charCounter[key]) {
      charCounter[key] = 0;
    }

    charCounter[key]++;
  }

  return Object.entries(charCounter).map(([char, count]) => ({ character: char, count }));
}

/**
 * Counts the number of words in a given string.
 *
 * @param text - The input string to analyze.
 * @returns The number of words in the input string.
 */
export function getWordCount(text: string) {
  if (!text) {
    return 0;
  }

  return text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
}
