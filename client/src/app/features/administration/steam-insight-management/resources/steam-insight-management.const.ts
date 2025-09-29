import { HzStatusType } from '@hz/core/models';
import { SteamInsightAppType, SteamInsightUpdateStatus, SteamInsightUpdateType } from './steam-insight-management.enum';

export const APP_TYPE_OPTIONS = [
  { value: SteamInsightAppType.GAME, label: 'Game' },
  { value: SteamInsightAppType.DLC, label: 'Dlc' },
];

export const UPDATE_TYPE_LABELS: Record<SteamInsightUpdateType, string> = {
  [SteamInsightUpdateType.INCREMENTAL]: 'Incremental',
  [SteamInsightUpdateType.FULL]: 'Full',
};

export const UPDATE_STATUS_META: Record<SteamInsightUpdateStatus, { label: string; chip: HzStatusType }> = {
  [SteamInsightUpdateStatus.RUNNING]: { label: 'Running', chip: 'base' },
  [SteamInsightUpdateStatus.COMPLETE]: { label: 'Complete', chip: 'success' },
  [SteamInsightUpdateStatus.CANCELED]: { label: 'Canceled', chip: 'warning' },
  [SteamInsightUpdateStatus.FAILED]: { label: 'Failed', chip: 'error' },
};

export const UPDATE_TYPE_OPTIONS = [
  { value: SteamInsightUpdateType.INCREMENTAL, label: 'Incremental' },
  { value: SteamInsightUpdateType.FULL, label: 'Full' },
];

export const UPDATE_STATUS_OPTIONS = [
  { value: SteamInsightUpdateStatus.RUNNING, label: 'Running' },
  { value: SteamInsightUpdateStatus.COMPLETE, label: 'Complete' },
  { value: SteamInsightUpdateStatus.CANCELED, label: 'Canceled' },
  { value: SteamInsightUpdateStatus.FAILED, label: 'Failed' },
];
