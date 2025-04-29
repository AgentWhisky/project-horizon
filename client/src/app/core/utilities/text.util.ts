import { charLabels } from '../constants/text.constants';
import { CharacterBreakdown, CharacterCount, WordBreakdown, WordCount } from '../types/text.type';

/**
 * Analyzes a string and returns a breakdown of each character and how many times it appears.
 *
 * @param text - The input string to analyze.
 * @param caseSensitive - Whether to treat uppercase and lowercase letters as different characters.
 * @returns A CharacterBreakdown object, with an array of character counts and total characters
 */
export function getCharacterBreakdown(text: string, caseSensitive: boolean = true): CharacterBreakdown {
  if (!text) {
    return {
      total: 0,
      characterCount: [],
    };
  }

  // Check case sensitivity
  if (!caseSensitive) {
    text = text.toUpperCase();
  }

  const charCounter: Record<string, number> = {};
  const totalChars = text.length;

  for (const char of text) {
    // Check for non-visible special characters
    const key = charLabels[char] ?? char;

    if (!charCounter[key]) {
      charCounter[key] = 0;
    }

    charCounter[key]++;
  }

  const characterCount: CharacterCount[] = Object.entries(charCounter).map(([char, count]) => ({
    character: char,
    count,
    percent: parseFloat(((count / totalChars) * 100).toFixed(2)),
  }));

  return {
    total: totalChars,
    characterCount,
  };
}

/**
 * Analyzes a string and returns a breakdown of each word and how many times it appears.
 * All words are forced to lowercase then capitalized.
 * Special characters are removed from words before counting.
 *
 * @param text - The input string to analyze.
 * @returns A WordBreakdown object, with an array of word counts and total words
 */
export function getWordBreakdown(text: string): WordBreakdown {
  if (!text) {
    return {
      total: 0,
      wordCount: [],
    };
  }

  const wordCounter: Record<string, number> = {};
  const rawWords = text.trim().split(/\s+/);

  const words = rawWords
    .map((word) => word.replace(/[^a-zA-Z0-9]/g, '')) // Remove special characters
    .filter((word) => word.length > 0); // Remove any empty results after cleanup

  const totalWords = words.length;

  for (const rawWord of words) {
    const lower = rawWord.toLowerCase();
    const word = lower.charAt(0).toUpperCase() + lower.slice(1);

    if (!wordCounter[word]) {
      wordCounter[word] = 0;
    }
    wordCounter[word]++;
  }

  const wordCount: WordCount[] = Object.entries(wordCounter).map(([word, count]) => ({
    word,
    count,
    percent: parseFloat(((count / totalWords) * 100).toFixed(2)),
  }));

  return {
    total: totalWords,
    wordCount,
  };
}
