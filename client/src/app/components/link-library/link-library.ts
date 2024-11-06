export interface LibraryLink {
  id: number;
  url: string;
  name: string;
  description: string;
  category: string;
  tags?: string[];
  thumbnail?: string;
}

export interface LinksByCategory {
  [category: string]: Omit<LibraryLink, 'category'>[];
}