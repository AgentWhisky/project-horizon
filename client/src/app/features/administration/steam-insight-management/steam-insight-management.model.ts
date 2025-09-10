export interface SteamInsightDashboard {
  appStats: SteamInsightStat[];
  updateStats: SteamInsightStat[];
}

export interface SteamInsightStat {
  displayName: string;
  value: number | string;
}
