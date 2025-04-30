export interface CharacterBreakdown {
  character: string;
  count: number;
  percent: number;
}

export interface WordBreakdown {
  word: string;
  count: number;
  percent: number;
}

export interface TextBreakdown {
  // Default Analytics
  characterBreakdown: CharacterBreakdown[];
  wordBreakdown: WordBreakdown[];
  characterCount: number;
  wordCount: number;
  lineCount: number;
  sentenceCount: number;
  paragraphCount: number;

  // Time Estimate Analytics
  averageWordLength: number;
  averageReadTimeSeconds: number;
  averageSpeakingTimeSeconds: number;
  averageTypingTimeSeconds: number;

  // Content Quality Analytics
  longestWord: string;
  shortestWord: string;
  uniqueWordCount: number;
  repetitionRate: number;

  // Text Readability Analytics
  fleschReadingEaseScore: number;
  fleschKincaidGradeLevel: number;
  gunningFogIndex: number;
  smogIndex: number;
  automatedReadabilityIndex: number;
  colemanLiauIndex: number;
}

export interface AnalyzeTextOptions {
  timeEstimateAnalytics?: boolean;
  contentQualityAnalytics?: boolean;
  readabilityAnalytics?: boolean;
}

export interface ReadabilityStats {
  fleschReadingEase: number;
  fleschKincaidGradeLevel: number;
  gunningFogIndex: number;
  smogIndex: number;
  automatedReadabilityIndex: number;
  colemanLiauIndex: number;
}
