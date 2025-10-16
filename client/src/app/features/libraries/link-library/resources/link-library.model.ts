export interface Link {
  id: number;
  name: string;
  description: string;
  url: string;
  icon: string;
  category: LinkCategory;
  tags: LinkTag[];
  sortKey: string;
  contrastBackground: number;
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
