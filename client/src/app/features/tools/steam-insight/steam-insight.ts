export interface SteamGameSummary {
  appid: number;
  name: string;
  headerImage: string;
  shortDescription: string;
  categories: string[];
}

export interface PageSettings {
  pageLength: number;
  pageSize: number;
}

export interface SteamAppSearchInfo {
  pageLength: number;
  pageSize: number;
  steamGames: SteamGameSummary[];
}

export interface SteamGameSearchOptions {
  search?: string;
  allowAdultContent?: boolean;
  pageIndex?: number;
  pageSize?: number;
}
