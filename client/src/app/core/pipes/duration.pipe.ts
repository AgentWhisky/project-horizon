import { Pipe, PipeTransform } from '@angular/core';
import { TimespanPipe } from './timespan.pipe';

@Pipe({
  name: 'duration',
  standalone: true,
})
export class DurationPipe implements PipeTransform {
  private readonly timespanPipe = new TimespanPipe();

  transform(start: Date | string | null, end: Date | string | null): string {
    if (!start || !end) {
      return '';
    }

    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();

    if (isNaN(startTime) || isNaN(endTime)) {
      return '';
    }

    const diffMs = Math.abs(endTime - startTime);

    return this.timespanPipe.transform(diffMs, 'ms');
  }
}
