import { HzStatusType } from '@hz/core/models';

export function getUpdateType(code: string): string {
  switch (code) {
    case 'I':
      return 'Incremental';
    case 'F':
      return 'Full';
    default:
      return code;
  }
}

export function getUpdateStatus(code: string): string {
  switch (code) {
    case 'R':
      return 'Run';
    case 'C':
      return 'Complete';
    case 'X':
      return 'Canceled';
    case 'F':
      return 'Failed';
    default:
      return code;
  }
}

export function getUpdateStatusType(code: string): HzStatusType {
  switch (code) {
    case 'R':
      return 'base';
    case 'C':
      return 'success';
    case 'X':
      return 'warning';
    case 'F':
      return 'error';
    default:
      return 'base';
  }
}
