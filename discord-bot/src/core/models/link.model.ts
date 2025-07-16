export interface Link {
  id: number;
  url: string;
  name: string;
  description: string;
  category: LinkCategory | null;
  tags: LinkTag[];
  sortKey: string;
}

export interface LinkCategory {
  id: number;
  name: string;
  description: string;
}

export interface LinkTag {
  id: number;
  name: string;
}
