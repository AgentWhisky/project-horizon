import { ImageContrastBackground } from 'src/common/enums/link-library.enum';

// *** LINKS ***
export interface LinkPayload {
  name: string;
  description: string;
  url: string;
  icon: string;
  category: number | null;
  tags: number[];
  sortKey?: string;
  contrastBackground: ImageContrastBackground;
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
  contrastBackground: ImageContrastBackground;
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

// *** Link Library ***
export interface LibraryLink {
  url: string;
  name: string;
  description: string;
  category: number | null;
  tags: number[];
  sortKey?: string;
}

export interface LibraryCategory {
  id: number;
  name: string;
  description: string;
}

export interface LibraryTag {
  id: number;
  name: string;
}

export interface LinkLibrary {
  links: LibraryLink[];
  categories: LibraryCategory[];
  tags: LibraryTag[];
}
