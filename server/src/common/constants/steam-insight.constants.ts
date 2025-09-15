export const APP_SAVE_TYPE = {
  insert: 'I',
  update: 'U',
  noChange: 'N',
} as const;

export const APP_TYPE = {
  game: 'game',
  dlc: 'dlc',
} as const;

/** API */
export const MAX_STEAM_API_RETRIES = 5 as const;
export const MAX_STEAM_API_PAGES = 10000 as const;

export const STEAM_API_RETRY_DELAY = {
  rateLimit: 300000, // 5 Minutes
  error: 5000, // 5 Seconds
} as const;

export const STEAM_INSIGHT_PAGE_SIZE = 20 as const;

/**
 * Steam Web API: IStoreService/GetAppList (v1)
 *
 * Retrieves a list of applications available on the Steam Store.
 *
 * Endpoint:
 *   GET https://api.steampowered.com/IStoreService/GetAppList/v1
 *
 * Parameters:
 *   - key (string)                  : Access key (if required).
 *   - if_modified_since (uint32)    : Return only items modified since this UNIX timestamp.
 *   - have_description_language (string) : Return only items with a description in this language.
 *   - include_games (bool)          : Include games (default: true).
 *   - include_dlc (bool)            : Include downloadable content.
 *   - include_software (bool)       : Include software items.
 *   - include_videos (bool)         : Include videos and series.
 *   - include_hardware (bool)       : Include hardware.
 *   - last_appid (uint32)           : For pagination, pass the last appid from the previous call.
 *   - max_results (uint32)          : Number of results to return (default: 10,000; max: 50,000).
 */
const STEAM_API_GET_APPLIST_URL = 'https://api.steampowered.com/IStoreService/GetAppList/v1' as const;

/**
 * Steam Storefront API: appdetails
 *
 * Retrieves detailed information about one or more Steam apps.
 *
 * Endpoint:
 *   GET https://store.steampowered.com/api/appdetails
 *
 * Parameters:
 *   - appids (string)      : One App ID (Ignore plurality).
 *   - cc (string)          : Country code for pricing/currency (e.g. "us").
 *   - l (string)           : Language code for text fields (e.g. "english").
 *   - v (uint32)           : Data version (optional).
 */
const STEAM_API_GET_APPINFO_URL = 'https://store.steampowered.com/api/appdetails' as const;

/**
 * Steam Web API: ISteamUserStats/GetSchemaForGame (v2)
 *
 * Retrieves the schema (stats and achievements) for a specific Steam game.
 *
 * Endpoint:
 *   GET https://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v2
 *
 * Parameters:
 *   - key (string)  : Steamworks Web API publisher/authentication key.
 *   - appid (uint32): The App ID (game) to retrieve the schema for.
 *   - l (string)    : (Optional) Language code for localization (e.g., "english", "french").
 */
const STEAM_API_GET_APPSCHEMA_URL = 'https://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v2' as const;

export const STEAM_API_URLS = {
  list: STEAM_API_GET_APPLIST_URL,
  info: STEAM_API_GET_APPINFO_URL,
  schema: STEAM_API_GET_APPSCHEMA_URL,
} as const;

/** MESSAGES */
export const STEAM_UPDATE_MESSAGES = {
  updateQueued: 'Steam update has been queued',
  updateStarted: 'Steam update has been started',
  updateComplete: 'Steam update is complete',
  updateCanceled: 'Steam update has been canceled',
} as const;

export const STEAM_UPDATE_ERRORS = {
  updateInProgressError: 'Steam update already in progress',
  updatesDisabledError: 'Steam updates are disabled by configuration',
  updateError: 'Steam update has encountered an error',
  maxPageError: 'Exceeded max page count',
  apiKeyNotFoundError: 'Steam API key missing or invalid',
  apiKeyRejectedError: 'Steam API key has been rejected',
} as const;
