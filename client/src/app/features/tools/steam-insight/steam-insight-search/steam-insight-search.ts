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

export interface SteamGameSearchOptions {
  search?: string;
  pageIndex?: number;
  pageSize?: number;
}
