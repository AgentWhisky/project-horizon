export interface SteamAppDetails {
  appid: number;
  name: string;
  lastModified: Date;
  type: string;

  // Info
  releaseDate: string;
  supportUrl: string;
  supportEmail: string;
  website: string;

  // Media
  headerImage: string;
  backgroundUrl: string;
  screenshots: Screenshot[];
  movies: Movie[];

  // Arrays
  dlc: DlcDetails[];
  developers: string[];
  publishers: string[];
  categories: string[];
  genres: string[];

  // Text
  aboutTheGame: string;
  shortDescription: string;
  supportedLanguages: string;
  legalNotice: string;

  // Achievements
  achievements: AchievementBlock;

  // DLC Full Game
  fullgame: { appid: number; name: string };

  // Requirements
  pcMinimum: string;
  pcRecommended: string;
  macMinimum: string;
  macRecommended: string;
  linuxMinimum: string;
  linuxRecommended: string;

  // Platforms
  supportsWindows: boolean;
  supportsMac: boolean;
  supportsLinux: boolean;

  // Reviews
  metacriticScore: number;
  metacriticUrl: string;
}

export interface Screenshot {
  id: number;
  path_thumbnail: string;
  path_full: string;
}

export interface Movie {
  id: number;
  name: string;
  thumbnail: string;
  mp4: {
    '480': string;
    max: string;
  };
  webm: {
    '480': string;
    max: string;
  };
  highlight: boolean;
}

export interface Achievement {
  name: string;
  defaultvalue: number;
  displayName: string;
  hidden: number;
  description: string;
  icon: string;
  icongray: string;
}

export interface AchievementBlock {
  total: number;
  data: Achievement[];
}

export interface DlcDetails {
  appid: number;
  name: string;
  headerImage: string;
  shortDescription: string;
  releaseDate: string;
}

export interface RatingDetails {
  rating: string;
  descriptors?: string;
  required_age?: string;
  use_age_gate?: string;
  interactive_elements?: string;
}

// EMPTY APP DETAILS
export const emptySteamAppDetails: SteamAppDetails = {
  appid: 0,
  name: '',
  lastModified: new Date(0),
  type: '',

  // APP INFO

  releaseDate: '',
  supportUrl: '',
  supportEmail: '',

  // ARRAYS
  dlc: [],
  developers: [],
  publishers: [],
  categories: [],
  genres: [],

  // TEXT
  aboutTheGame: '',
  shortDescription: '',
  supportedLanguages: '',
  legalNotice: '',

  // JSON OBJECTS
  screenshots: [],
  movies: [],
  achievements: {
    total: 0,
    data: [],
  },

  fullgame: {
    appid: 0,
    name: '',
  },

  // URLS & MEDIA
  headerImage: '',
  website: '',
  backgroundUrl: '',

  // REQUIREMENTS
  pcMinimum: '',
  pcRecommended: '',
  macMinimum: '',
  macRecommended: '',
  linuxMinimum: '',
  linuxRecommended: '',

  // PLATFORMS
  supportsWindows: false,
  supportsMac: false,
  supportsLinux: false,

  // REVIEWS
  metacriticScore: 0,
  metacriticUrl: '',
};

export interface DlcDetails {
  appid: number;
  name: string;
  headerImage: string;
  shortDescription: string;
  releaseDate: string;
}
