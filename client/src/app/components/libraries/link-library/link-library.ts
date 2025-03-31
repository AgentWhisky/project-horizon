export interface Link {
  id: number;
  url: string;
  name: string;
  description: string;
  category: LinkCategory;
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

export interface LinksByCategory {
  id: number;
  name: string;
  description: string;
  links: Link[];
}

export interface LinkLibrary {
  links: Link[];
  categories: string[];
  tags: string[];
}
