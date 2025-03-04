export interface Link {
  id: number;
  url: string;
  name: string;
  description: string;
  category: LinkCategory;
  tags: LinkTag[];
  thumbnail?: string;
}

export interface LinkData {
  url: string;
  name: string;
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

export interface LinkCategoryData {
  name: string;
  description: string;
}

export interface LinkCategoryCode extends LinkCategory {
  inUse: boolean;
}

export interface LinkTag {
  id: number;
  name: string;
}

export interface LinkTagData {
  name: string;
}

export interface LinkTagCode extends LinkTag {
  inUse: boolean;
}
