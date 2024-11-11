export interface Link {
  id: number;
  url: string;
  name: string;
  description: string;
  category: string;
  tags: LinkTag[];
  thumbnail?: string;
}

export interface LinkTag {
  id: number;
  name: string;
}
