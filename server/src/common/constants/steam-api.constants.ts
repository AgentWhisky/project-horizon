export const MAX_STEAM_API_RETRIES = 5;

export const STEAM_API_RETRY = {
  RATE_LIMIT: 300000, // 5 Minutes
  ERROR: 5000, // 5 Seconds
};

export const STEAM_API_URLS = {
  LIST: 'https://api.steampowered.com/IStoreService/GetAppList/v1/',
  INFO: 'https://store.steampowered.com/api/appdetails',
  SCHEMA: 'https://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v2/',
} as const;

export const STEAM_INSIGHT_PAGE_SIZE = 20;
