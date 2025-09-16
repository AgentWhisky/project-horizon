// *** DASHBOARD ***
export interface SteamInsightDashboard {
  appStats: SteamInsightStat[];
  updateStats: SteamInsightStat[];
  runningUpdate?: SteamInsightUpdate;
  recentUpdates: SteamInsightUpdate[];
}

export interface SteamInsightStat {
  displayName: string;
  value: number | string;
}

export interface SteamInsightUpdate {
  id: number;
  updateType: string;
  updateStatus: string;
  startTime: Date;
  endTime: Date;
  events: string[];
}
