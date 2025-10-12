import { Pipe, PipeTransform } from '@angular/core';
import { HzStatusType } from '@hz/core/models';

/**
 * Transforms update type codes ('I', 'F') into display text
 */
@Pipe({
  name: 'updateType',
})
export class UpdateTypePipe implements PipeTransform {
  transform(code: string | null | undefined): string {
    switch (code) {
      case 'I':
        return 'Incremental';
      case 'F':
        return 'Full';
      default:
        return code ?? '';
    }
  }
}

/**
 * Transforms update status codes ('R', 'C', 'X', 'F') into display text
 */
@Pipe({
  name: 'updateStatus',
})
export class UpdateStatusPipe implements PipeTransform {
  transform(code: string | null | undefined): string {
    switch (code) {
      case 'R':
        return 'Running';
      case 'C':
        return 'Complete';
      case 'X':
        return 'Canceled';
      case 'F':
        return 'Failed';
      default:
        return code ?? '';
    }
  }
}

/**
 * Maps update status codes to visual status type (HzStatusType)
 */
@Pipe({ name: 'updateStatusType', standalone: true })
export class UpdateStatusTypePipe implements PipeTransform {
  transform(code: string | null | undefined): HzStatusType {
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
}
