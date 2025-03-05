export interface Link {
  id: number;
  url: string;
  name: string;
  description: string;
  category: LinkCategory;
  tags: LinkTag[];
  thumbnail?: string;
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
