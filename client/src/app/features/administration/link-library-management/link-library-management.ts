// *** LINKS ***
export interface LinkPayload {
  name: string;
  description: string;
  url: string;
  icon: string;
  category: number | null;
  tags: number[];
  sortKey: string;
}

export interface Link {
  id: number;
  name: string;
  description: string;
  url: string;
  icon: string;
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

// *** CATEGORY ***
export interface CategoryPayload {
  name: string;
  description: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  inUse: boolean;
}

// *** TAG ***
export interface TagPayload {
  name: string;
}

export interface Tag {
  id: number;
  name: string;
  inUse: boolean;
}
