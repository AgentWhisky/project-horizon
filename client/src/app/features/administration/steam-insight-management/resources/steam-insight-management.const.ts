import { HzStatusType } from '@hz/core/models';
import { UpdateStatus, UpdateType } from './steam-insight-management.enum';

export const UPDATE_TYPE_LABELS: Record<UpdateType, string> = {
  [UpdateType.INCREMENTAL]: 'Incremental',
  [UpdateType.FULL]: 'Full',
};

export const UPDATE_STATUS_META: Record<UpdateStatus, { label: string; chip: HzStatusType }> = {
  [UpdateStatus.RUNNING]: { label: 'Running', chip: 'base' },
  [UpdateStatus.COMPLETE]: { label: 'Complete', chip: 'success' },
  [UpdateStatus.CANCELED]: { label: 'Canceled', chip: 'warning' },
  [UpdateStatus.FAILED]: { label: 'Failed', chip: 'error' },
};

export const UPDATE_TYPE_OPTIONS = [
  { value: UpdateType.INCREMENTAL, label: 'Incremental' },
  { value: UpdateType.FULL, label: 'Full' },
];

export const UPDATE_STATUS_OPTIONS = [
  { value: UpdateStatus.RUNNING, label: 'Running' },
  { value: UpdateStatus.COMPLETE, label: 'Complete' },
  { value: UpdateStatus.CANCELED, label: 'Canceled' },
  { value: UpdateStatus.FAILED, label: 'Failed' },
];
