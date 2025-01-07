export interface Link {
  id: number;
  url: string;
  name: string;
  description: string;
  category: LinkCategory;
  tags?: LinkTag[];
  thumbnail?: string;
}

export interface NewLink {
  name: string;
  url: string;
  description: string;
  category: number;
  tags: number[];
  thumbnail?: string;
}

export interface LinkCategory {
  id: number;
  name: string;
  description: string;
}

export interface NewLinkCategory {
  name: string;
  description: string;
}

export interface LinkCategoryCode extends LinkCategory {
  inUse: boolean;
}

export interface LinksByCategory {
  id: number;
  name: string;
  description: string;
  links: Link[];
}

export interface LinkTag {
  id: number;
  name: string;
}

export interface NewLinkTag {
  name: string;
}

export interface LinkTagCode extends LinkTag {
  inUse: boolean;
}
