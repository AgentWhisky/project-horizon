import { SortOrder } from '@hz/core/enums';
import { SteamInsightUpdateField, UpdateStatus, UpdateType } from './steam-insight-management.enum';
import { HzEvent, HzStatusType } from '@hz/core/models';

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

// *** Steam Insight Updates ***
export interface SteamInsightUpdatesQuery {
  page?: number;
  pageSize?: number;
  sortBy?: SteamInsightUpdateField;
  sortOrder?: SortOrder;
  status?: UpdateStatus[];
  type?: UpdateType;
}

export interface SteamInsightUpdate {
  id: number;
  updateType: UpdateType;
  updateStatus: UpdateStatus;
  startTime: Date;
  endTime?: Date;
  stats?: {
    games: { inserts: number; updates: number; noChange: number };
    dlc: { inserts: number; updates: number; noChange: number };
    errors: number;
  };
  notes: string;
  events: HzEvent[];
}

export interface SteamInsightUpdateSearchResponse {
  pageLength: number;
  updates: SteamInsightUpdate[];
}

export interface SteamInsightUpdateRow {
  id: number;
  startTime: Date | null;
  endTime: Date | null;
  totalRuntime: number;
  updateStatus: string;
  updateStatusType: HzStatusType;
  updateType: string;
  notes: string;
  stats?: {
    games: { inserts: number; updates: number; noChange: number };
    dlc: { inserts: number; updates: number; noChange: number };
    errors: number;
  };
  events: HzEvent[];
}
