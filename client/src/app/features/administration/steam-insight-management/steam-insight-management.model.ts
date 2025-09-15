export interface SteamInsightDashboard {
  appStats: SteamInsightStat[];
  updateStats: SteamInsightStat[];
}

export interface SteamInsightStat {
  displayName: string;
  value: number | string;
}

// *** Steam Insight Updates ***
export enum UpdateType {
  Incremental = 'I',
  Full = 'F',
}

export enum UpdateStatus {
  Running = 'R',
  Complete = 'C',
  Canceled = 'X',
  Failed = 'F',
}

export interface SteamInsightUpdate {
  id: number;
  updateType: UpdateType;
  updateStatus: UpdateStatus;
  startTime: Date;
  endTime?: Date;
  stats: {
    games: { inserts: number; updates: number; noChange: number };
    dlc: { inserts: number; updates: number; noChange: number };
    errors: number;
  };
  notes: string;
  events: string[];
}
