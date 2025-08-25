export const STORAGE_KEYS = {
  THEME: {
    DARK_THEME: 'horizon.theme.darkTheme',
  },
  LEFT_NAV: {
    STATE: 'horizon.leftNav.state',
  },
  AUTH: {
    ACCESS_TOKEN: 'horizon.auth.accessToken',
    REFRESH_TOKEN: 'horizon.auth.refreshToken',
  },
  BASE_CONVERTER: {
    CONVERSIONS: 'horizon.baseConverter.conversions',
  },
  STEAM_INSIGHT: {
    HISTORY: 'horizon.steamInsight.history',
    SHOW_ACHIEVEMENTS: 'horizon.steamInsight.showAchievements',
  },
  PATHFINDER: {
    BOARD: 'horizon.pathfinder.board',
  },
} as const;
