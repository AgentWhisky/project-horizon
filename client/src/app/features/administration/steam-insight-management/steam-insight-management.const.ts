import { HzStatusType } from '@hz/core/models';
import { UpdateStatus, UpdateType } from './steam-insight-management.model';

export const UPDATE_TYPE_LABELS: Record<UpdateType, string> = {
  [UpdateType.Incremental]: 'Incremental',
  [UpdateType.Full]: 'Full',
};

export const UPDATE_STATUS_META: Record<UpdateStatus, { label: string; chip: HzStatusType }> = {
  [UpdateStatus.Running]: { label: 'Running', chip: 'base' },
  [UpdateStatus.Complete]: { label: 'Complete', chip: 'success' },
  [UpdateStatus.Canceled]: { label: 'Canceled', chip: 'warning' },
  [UpdateStatus.Failed]: { label: 'Failed', chip: 'error' },
};
