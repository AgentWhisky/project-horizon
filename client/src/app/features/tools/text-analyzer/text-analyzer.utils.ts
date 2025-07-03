import {
  AVERAGE_READ_WORD_PER_MINUTE,
  AVERAGE_SPEAK_WORD_PER_MINUTE,
  AVERAGE_TYPING_WORD_PER_MINUTE,
} from '../../../core/constants/average-action-time.constant';
import { CHAR_LABELS } from '../../../core/constants/text.constants';
import { countSyllables } from '../../../core/utilities/text.util';
import { AnalyzeTextOptions, CharacterBreakdown, ReadabilityStats, TextBreakdown, WordBreakdown } from './text-analyzer';

export function analyzeText(text: string, options?: AnalyzeTextOptions): TextBreakdown {
  const textBreakdown = createEmptyTextBreakdown();
  if (!text) {
    return textBreakdown;
  }

  // Initial Calculations
  const words = text.match(/\b[\w@#]+(?:['’-][\w]+)*\b/g) || [];
  const sentences = text.match(/(?:[^.?!\n]+[.?!]+(?=\s|$))/g)?.map((s) => s.trim()) || [];
  const paragraphs = text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
  const lines = text.split('\n');

  // Default Analytics
  textBreakdown.characterCount = text.length;
  textBreakdown.wordCount = words.length;
  textBreakdown.lineCount = lines.length;
  textBreakdown.sentenceCount = sentences.length;
  textBreakdown.paragraphCount = paragraphs.length;
  textBreakdown.characterBreakdown = getCharacterBreakdown(text);
  textBreakdown.wordBreakdown = getWordBreakdown(words);

  // Time Estimate Analytics
  if (options && options.timeEstimateAnalytics) {
    const totalWordLength = words.reduce((sum, word) => sum + word.length, 0);

    textBreakdown.averageWordLength = totalWordLength / words.length;
    textBreakdown.averageReadTimeSeconds = (words.length / AVERAGE_READ_WORD_PER_MINUTE) * 60;
    textBreakdown.averageSpeakingTimeSeconds = (words.length / AVERAGE_SPEAK_WORD_PER_MINUTE) * 60;
    textBreakdown.averageTypingTimeSeconds = (words.length / AVERAGE_TYPING_WORD_PER_MINUTE) * 60;
  }

  // Content Quality Analytics
  if (options && options.contentQualityAnalytics) {
    const { longestWord, shortestWord } = getLongestAndShortedWord(words);

    const wordFrequency: Record<string, number> = {};
    words.forEach((word) => {
      if (!wordFrequency[word]) {
        wordFrequency[word] = 0;
      }

      wordFrequency[word]++;
    });

    const uniqueWordCount = Object.keys(wordFrequency).length;

    textBreakdown.shortestWord = shortestWord;
    textBreakdown.longestWord = longestWord;
    textBreakdown.uniqueWordCount = uniqueWordCount;
    textBreakdown.repetitionRate = 1 - uniqueWordCount / words.length;
  }

  // Readability Analytics
  if (options && options.readabilityAnalytics) {
    const readabilityStatus = getReadabilityStats(text, words, sentences.length);

    textBreakdown.fleschReadingEaseScore = readabilityStatus.fleschReadingEase;
    textBreakdown.fleschKincaidGradeLevel = readabilityStatus.fleschKincaidGradeLevel;
    textBreakdown.gunningFogIndex = readabilityStatus.gunningFogIndex;
    textBreakdown.smogIndex = readabilityStatus.smogIndex;
    textBreakdown.automatedReadabilityIndex = readabilityStatus.automatedReadabilityIndex;
    textBreakdown.colemanLiauIndex = readabilityStatus.colemanLiauIndex;
  }

  return textBreakdown;
}

// *** PRIVATE FUNCTIONS ***
function getCharacterBreakdown(text: string): CharacterBreakdown[] {
  const charCounter: Record<string, number> = {};
  const totalChars = text.length;

  for (const char of text) {
    // Check for non-visible special characters
    const key = CHAR_LABELS[char] ?? char.toUpperCase();

    if (!charCounter[key]) {
      charCounter[key] = 0;
    }

    charCounter[key]++;
  }

  const characterBreakdown: CharacterBreakdown[] = Object.entries(charCounter).map(([char, count]) => ({
    character: char,
    count,
    percent: parseFloat(((count / totalChars) * 100).toFixed(2)),
  }));

  return characterBreakdown;
}

function getWordBreakdown(words: string[]): WordBreakdown[] {
  const wordCounter: Record<string, number> = {};
  const totalWords = words.length;

  words.forEach((rawWord) => {
    const lower = rawWord.toLowerCase();
    const word = lower.charAt(0).toUpperCase() + lower.slice(1);

    if (!wordCounter[word]) {
      wordCounter[word] = 0;
    }
    wordCounter[word]++;
  });

  const wordBreakdown: WordBreakdown[] = Object.entries(wordCounter).map(([word, count]) => ({
    word,
    count,
    percent: parseFloat(((count / totalWords) * 100).toFixed(2)),
  }));

  return wordBreakdown;
}

function getLongestAndShortedWord(words: string[]) {
  let longestWord = '';
  let shortestWord = '';

  words.forEach((word) => {
    if (word.length > longestWord.length) {
      longestWord = word;
    }
    if (shortestWord === '' || word.length < shortestWord.length) {
      shortestWord = word;
    }
  });

  return { longestWord, shortestWord };
}

function getReadabilityStats(text: string, words: string[], sentenceCount: number): ReadabilityStats {
  // Count Syllables and complex words (3+ syllables)
  let syllableCount = 0;
  let complexWordCount = 0;

  words.forEach((word) => {
    const syllablesInWord = countSyllables(word);
    syllableCount += syllablesInWord;

    if (syllablesInWord >= 3) {
      complexWordCount++;
    }
  });

  const characterCount = text.replace(/\s/g, '').length;
  const characterCountWithoutSpecial = text.replace(/[^a-zA-Z0-9]/g, '').length;
  const wordCount = words.length;

  // Calculate Scores
  const fleschReadingEase = 206.835 - 1.015 * (wordCount / sentenceCount) - 84.6 * (syllableCount / wordCount);
  const fleschKincaidGradeLevel = 0.39 * (wordCount / sentenceCount) + 11.8 * (syllableCount / wordCount) - 15.59;
  const gunningFogIndex = 0.4 * (wordCount / sentenceCount + 100 * (complexWordCount / wordCount));
  const smogIndex = 1.043 * Math.sqrt(complexWordCount * (30 / sentenceCount)) + 3.1291;
  const automatedReadabilityIndex = 4.71 * (characterCount / wordCount) + 0.5 * (wordCount / sentenceCount) - 21.43;
  const colemanLiauIndex = 0.0588 * ((characterCountWithoutSpecial / wordCount) * 100) - 0.296 * ((sentenceCount / wordCount) * 100) - 15.8;

  return {
    fleschReadingEase,
    fleschKincaidGradeLevel,
    gunningFogIndex,
    smogIndex,
    automatedReadabilityIndex,
    colemanLiauIndex,
  };
}

function createEmptyTextBreakdown(): TextBreakdown {
  return {
    characterBreakdown: [],
    wordBreakdown: [],
    characterCount: 0,
    wordCount: 0,
    lineCount: 0,
    sentenceCount: 0,
    paragraphCount: 0,

    averageWordLength: 0,
    averageReadTimeSeconds: 0,
    averageSpeakingTimeSeconds: 0,
    averageTypingTimeSeconds: 0,

    longestWord: '',
    shortestWord: '',
    uniqueWordCount: 0,
    repetitionRate: 0,

    fleschReadingEaseScore: 0,
    fleschKincaidGradeLevel: 0,
    gunningFogIndex: 0,
    smogIndex: 0,
    automatedReadabilityIndex: 0,
    colemanLiauIndex: 0,
  };
}
