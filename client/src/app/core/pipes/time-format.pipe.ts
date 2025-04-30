import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeFormat',
})
export class TimeFormatPipe implements PipeTransform {
  transform(seconds: number): string {
    if (seconds < 60) {
      return `${seconds.toFixed(0)} sec`;
    } else if (seconds < 3600) {
      return `${(seconds / 60).toFixed(1)} min`;
    } else {
      return `${(seconds / 3600).toFixed(2)} hr`;
    }
  }
}
