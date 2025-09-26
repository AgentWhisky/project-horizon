import { SortOrder } from '@hz/core/enums';
import { SteamInsightAppField, SteamInsightUpdateField, UpdateStatus, UpdateType } from './steam-insight-management.enum';
import { HzEvent, HzStatusType } from '@hz/core/models';

// *** DASHBOARD ***
export interface SteamInsightDashboard {
  appStats: SteamInsightStat[];
  updateStats: SteamInsightStat[];
  runningUpdate?: SteamInsightUpdateSimple;
  recentUpdates: SteamInsightUpdateSimple[];
}

export interface SteamInsightStat {
  displayName: string;
  value: number | string;
}

export interface SteamInsightUpdateSimple {
  id: number;
  updateType: UpdateType;
  updateStatus: UpdateStatus;
  startTime: Date;
  endTime?: Date;
  events?: HzEvent[];
}

/** STEAM INSIGHT APP SEARCH */
export interface SteamInsightAppsQuery {
  page?: number;
  pageSize?: number;
  sortBy?: SteamInsightAppField;
  sortOrder?: SortOrder;
  appid?: number;
  keywords?: string;
  isAdult?: boolean;
  validationFailed?: boolean;
  active?: boolean;
}

export interface SteamInsightAppResponse {
  appid: number;
  name: string;
  type: string;
  isAdult: boolean;
  validationFailed: boolean;
  active: boolean;
  createdDate: Date;
  updatedDate: Date;
}

export interface SteamInsightAppSearchResponse {
  pageLength: number;
  apps: SteamInsightAppResponse[];
}

/** STEAM INSIGHT UPDATES */
export interface SteamInsightUpdatesQuery {
  page?: number;
  pageSize?: number;
  sortBy?: SteamInsightUpdateField;
  sortOrder?: SortOrder;
  status?: UpdateStatus[];
  type?: UpdateType;
}

export interface SteamInsightUpdateStats {
  games: { inserts: number; updates: number; noChange: number };
  dlc: { inserts: number; updates: number; noChange: number };
  errors: number;
  total: number;
}

export interface SteamInsightUpdate {
  id: number;
  updateType: UpdateType;
  updateStatus: UpdateStatus;
  startTime: Date;
  endTime?: Date;
  stats?: SteamInsightUpdateStats;
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
  stats?: SteamInsightUpdateStats;
  events: HzEvent[];
}
