// *** STEAM SEARCH ***
export interface SteamGameSummary {
  appid: number;
  name: string;
  headerImage: string;
  shortDescription: string;
  categories: string[];
}

export interface SteamAppSearchInfo {
  pageLength: number;
  steamGames: SteamGameSummary[];
}

export interface SteamAppSearchOptions {
  search?: string;
  allowAdultContent?: boolean;
  pageIndex?: number;
}

// *** STEAM DETAIL ***
export interface SteamAppDetails {
  appid: number;
  name: string;
  lastModified: Date;
  type: string;

  // APP INFO
  requiredAge: number;
  isFree: boolean;
  recommendationsTotal: number;
  comingSoon: boolean;
  releaseDate: string;
  supportUrl: string;
  supportEmail: string;
  contentDescriptorNotes: string;

  // ARRAYS
  dlc: number[];
  packages: number[];
  contentDescriptorIds: number[];
  developers: string[];
  publishers: string[];
  categories: string[];
  genres: string[];

  // TEXT
  detailedDescription: string;
  aboutTheGame: string;
  shortDescription: string;
  supportedLanguages: string;
  reviews: string;
  legalNotice: string;

  // JSON OBJECTS
  screenshots: { id: number; path_thumbnail: string; path_full: string }[];
  movies: {
    id: number;
    name: string;
    thumbnail: string;
    video_urls: {
      webm_480: string;
      webm_max: string;
      mp4_480: string;
      mp4_max: string;
    };
    highlight: boolean;
  }[];
  achievements: {
    total: number;
    data: {
      name: string;
      defaultvalue: number;
      displayName: string;
      hidden: number;
      description: string;
      icon: string;
      icongray: string;
    }[];
  };

  ratings: {
    esrb?: RatingDetails;
    dejus?: RatingDetails;
    pegi?: RatingDetails;
    usk?: RatingDetails;
    nzoflc?: RatingDetails;
    fpb?: RatingDetails;
    csrr?: RatingDetails;
    cero?: RatingDetails;
    crl?: RatingDetails;
  };
  packageGroups: {
    name: string;
    title: string;
    description: string;
    selection_text: string;
    save_text: string;
    display_type: number;
    is_recurring_subscription: string;
    subs: {
      packageid: number;
      percent_savings_text: string;
      percent_savings: number;
      option_text: string;
      option_description: string;
      can_get_free_license: string;
      is_free_license: boolean;
      price_in_cents_with_discount: number;
    }[];
  }[];
  demos: { appid: number; description: string }[];
  fullgame: { appid: number; name: string };

  // URLS & MEDIA
  headerImage: string;
  capsuleImage: string;
  capsuleImagev5: string;
  website: string;
  backgroundUrl: string;
  backgroundRawUrl: string;

  // REQUIREMENTS
  pcMinimum: string;
  pcRecommended: string;
  macMinimum: string;
  macRecommended: string;
  linuxMinimum: string;
  linuxRecommended: string;

  // PLATFORMS
  supportsWindows: boolean;
  supportsMac: boolean;
  supportsLinux: boolean;

  // PRICE
  currency: string;
  initialPrice: number;
  finalPrice: number;
  discountPercent: number;
  initialFormatted: string;
  finalFormatted: string;

  // REVIEWS
  metacriticScore: number;
  metacriticUrl: string;
}

export interface RatingDetails {
  rating: string;
  descriptors?: string;
  required_age?: string;
  use_age_gate?: string;
  interactive_elements?: string;
}
