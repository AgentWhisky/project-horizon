export interface CharacterCount {
  character: string;
  count: number;
  percent: number;
}

export interface CharacterBreakdown {
  total: number;
  characterCount: CharacterCount[];
}

export interface WordCount {
  word: string;
  count: number;
  percent: number;
}

export interface WordBreakdown {
  total: number;
  wordCount: WordCount[];
}
