import { SortOrder } from '@hz/core/enums';
import { HzEvent, HzStatusType } from '@hz/core/models';

import {
  SteamInsightAppField,
  SteamInsightAppType,
  SteamInsightAuditType,
  SteamInsightUpdateField,
  SteamInsightUpdateStatus,
  SteamInsightUpdateType,
} from './steam-insight-management.enum';

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
  updateType: SteamInsightUpdateType;
  updateStatus: SteamInsightUpdateStatus;
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
  type?: SteamInsightAppType;
  keywords?: string;
  isAdult?: boolean;
  validationFailed?: boolean;
  active?: boolean;
}

export interface SteamInsightApp {
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
  apps: SteamInsightApp[];
}

export interface AppActiveStatus {
  appid: number;
  active: boolean;
}

/** STEAM INSIGHT UPDATES */
export interface SteamInsightUpdatesQuery {
  page?: number;
  pageSize?: number;
  sortBy?: SteamInsightUpdateField;
  sortOrder?: SortOrder;
  status?: SteamInsightUpdateStatus[];
  type?: SteamInsightUpdateType;
}

export interface SteamInsightUpdateStats {
  games: { inserts: number; updates: number; noChange: number };
  dlc: { inserts: number; updates: number; noChange: number };
  errors: number;
  total: number;
}

export interface SteamInsightUpdate {
  id: number;
  updateType: SteamInsightUpdateType;
  updateStatus: SteamInsightUpdateStatus;
  startTime: Date;
  endTime?: Date;
  notes: string;
}

export interface SteamInsightUpdateSearchResponse {
  pageLength: number;
  updates: SteamInsightUpdate[];
}

// *** APP OVERVIEW ***
export interface SteamInsightAppRaw {
  appid: number;
  name: string;
  type: string;
  active: boolean;
  validationFailed: boolean;
  audits: SteamInsightAppAudit[];
  [key: string]: unknown;
}

export interface SteamInsightAppAudit {
  id: number;
  appid: number;
  changeType: SteamInsightAuditType;
  changes: Record<string, { before: unknown; after: unknown }>;
  createdDate: Date;
}

export interface AppActiveStatus {
  appid: number;
  active: boolean;
}

// *** UPDATE OVERVIEW ***
export interface SteamInsightUpdateOverview {
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
