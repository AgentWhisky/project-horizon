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

<<<<<<< HEAD
export interface SteamInsightUpdate {
  id: number;
  updateType: string;
  updateStatus: string;
  startTime: Date;
  endTime: Date;
=======
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
>>>>>>> f66ef8feba239927bf2fbbac846ccd07604e2714
  events: string[];
}
