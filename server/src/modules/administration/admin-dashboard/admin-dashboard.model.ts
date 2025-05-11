export interface AdminDashboardInfo {
  settings: SettingsInfo;
  steamInsight: SteamInsightInfo;
}

export interface SettingsInfo {
  creationCode: string;
}

export interface SteamInsightInfo {
  logs: SteamAppUpdateLog[];

  // Last Week
  totalNewGames: number;
  totalUpdatedGames: number;
  totalNewDlc: number;
  totalUpdatedDlc: number;
  totalFailures: number;

  // All Time
  totalGames: number;
  totalDLC: number;
  gameLastModified: Date;
  dlcLastModified: Date;
  maxAppid: number;
}

export interface SteamAppUpdateLog {
  id: number;
  startTime: Date;
  endTime: Date;
  successCount: number;
  failureCount: number;
  successAppIds: number[];
  failureAppIds: number[];
  createdGameCount: number;
  createdDlcCount: number;
  updatedGameCount: number;
  updatedDlcCount: number;
  notes: string;
}

export interface CreationCodeRefresh {
  creationCode: string;
}
