export interface Link {
  id: number;
  url: string;
  name: string;
  description: string;
  category: LinkCategory;
  tags: LinkTag[];
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
