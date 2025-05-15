export interface SteamGameSummary {
  appid: number;
  name: string;
  headerImage: string;
  shortDescription: string;
  categories: string[];
}

export interface SteamAppSearchInfo {
  pageLength: number;
  pageSize: number;
  steamGames: SteamGameSummary[];
}

export interface SteamAppSearchOptions {
  search?: string;
  allowAdultContent?: boolean;
  pageIndex?: number;
  pageSize?: number;
}
