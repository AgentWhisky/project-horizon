import { SteamInsightUpdateStatus, SteamInsightUpdateType } from '@hz/common/enums';
import { HzEvent } from '@hz/common/model';
import { SteamAppAuditEntity, SteamAppChangeType } from '@hz/entities/steam-app-audit.entity';

// *** STEAM INSIGHT UPDATES ***
export interface SteamAppEntry {
  appid: number;
  type: string;
  action: 'CREATE' | 'UPDATE';
}

export interface SteamListApp {
  appid: number;
  name: string;
  last_modified: number;
  price_change_number: number;
}

export interface SteamAppInfo {
  type: string;
  name: string;
  steam_appid: number;
  required_age: number | string;
  controller_support?: string;
  is_free: boolean;
  dlc?: number[];
  detailed_description: string;
  about_the_game: string;
  short_description: string;
  fullgame?: { appid: number; name: string }[];
  supported_languages: string;
  header_image: string;
  capsule_image?: string;
  capsule_imagev5?: string;
  website?: string;
  background?: string;
  background_raw?: string;
  reviews?: string;
  legal_notice?: string;
  ratings?: any;
  developers?: string[];
  publishers?: string[];
  categories?: { id: number; description: string }[];
  genres?: { id: string; description: string }[];
  screenshots?: Screenshot[];
  movies?: Movie[];
  achievements?: {
    total: number;
    highlighted: { name: string; path: string }[];
  };
  release_date: {
    coming_soon: boolean;
    date: string;
  };
  support_info?: {
    url: string;
    email: string;
  };
  content_descriptors?: {
    ids?: number[];
    notes?: string;
  };
  platforms?: {
    windows: boolean;
    mac: boolean;
    linux: boolean;
  };
  metacritic?: {
    score: number;
    url: string;
  };
  recommendations?: {
    total: number;
  };
  price_overview?: {
    currency: string;
    initial: number;
    final: number;
    discount_percent: number;
    initial_formatted: string;
    final_formatted: string;
  };
  packages?: number[];
  package_groups?: PackageGroup[];
  demos?: { appid: number; description: string }[];
  pc_requirements?: Requirements;
  mac_requirements?: Requirements;
  linux_requirements?: Requirements;
}

export interface SteamAppAchievements {
  total: number;
  data: SteamAchievement[];
}

export interface SteamAchievement {
  name: string;
  defaultvalue: number;
  displayName: string;
  hidden: number;
  description: string;
  icon: string;
  icongray: string;
}

export interface Requirements {
  minimum: string;
  recommended?: string;
}

export interface PackageGroup {
  name: string;
  title: string;
  description: string;
  selection_text: string;
  save_text: string;
  display_type: 0 | 1;
  is_recurring_subscription?: string;
  subs: {
    packageid: number;
    percent_savings_text: string;
    percent_savings: number;
    option_text: string;
    option_description: string;
    can_get_free_license?: string;
    is_free_license: boolean;
    price_in_cents_with_discount: number;
  }[];
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
  webm: { '480': string; max: string };
  mp4: { '480': string; max: string };
  highlight: boolean;
}

export interface AppInfoResult {
  appid: number;
  appType: string;
  saveType: string;
}

// *** ADMINISTRATION PAGE ***
export interface SteamInsightDashboard {
  appStats: SteamInsightStat[];
  updateStats: SteamInsightStat[];
  runningUpdate?: SteamInsightUpdateSimple;
  recentUpdates: SteamInsightUpdateSimple[];
}

export interface SteamInsightStat {
  displayName: string;
  value: number | string;
}

export interface SteamAppStats {
  total_games: string;
  total_dlc: string;
  adult_apps: string;
  total_validation_failed: string;
  inactive_apps: string;
  max_appid: string;
}

export interface SteamUpdateStats {
  complete_updates: string;
  canceled_updates: string;
  failed_updates: string;
}

/** STEAM INSIGHT APP SEARCH */
export interface SteamInsightAppResponse {
  appid: number;
  name: string;
  type: string;
  isAdult: boolean;
  validationFailed: boolean;
  active: boolean;
  createdDate: Date;
  updatedDate: Date;
}

export interface SteamInsightAppSearchResponse {
  pageLength: number;
  apps: SteamInsightAppResponse[];
}

/** STEAM INSIGHT UPDATES */
export interface SteamInsightUpdateSimple {
  id: number;
  updateType: SteamInsightUpdateType;
  updateStatus: SteamInsightUpdateStatus;
  startTime: Date;
  endTime?: Date;
  events?: HzEvent[];
}

export interface SteamInsightUpdate {
  id: number;
  updateType: SteamInsightUpdateType;
  updateStatus: SteamInsightUpdateStatus;
  startTime: Date;
  endTime?: Date;
  stats: {
    games: { inserts: number; updates: number; noChange: number };
    dlc: { inserts: number; updates: number; noChange: number };
    errors: number;
    total: number;
  };
  notes: string;
  events: HzEvent[];
}

export interface SteamInsightUpdateSearchResponse {
  pageLength: number;
  updates: SteamInsightUpdate[];
}

/** STEAM INSIGHT APP */
export interface AppActiveStatus {
  appid: number;
  active: boolean;
}

export interface SteamInsightAppRaw {
  name?: string;
  appid?: number;
  type?: string;
  audits?: SteamInsightAppAudit[];
  [key: string]: unknown;
}

export interface SteamInsightAppAudit {
  id: number;
  appid: number;
  changeType: SteamAppChangeType;
  changes: Record<string, unknown>;
  createdDate: Date;
}
