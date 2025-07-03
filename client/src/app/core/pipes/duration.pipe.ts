import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'duration',
})
export class DurationPipe implements PipeTransform {
  transform(value: number, unit: 'ms' | 's' = 'ms'): string {
    const totalSeconds = unit === 'ms' ? Math.floor(value / 1000) : Math.floor(value);

    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const sections = [
      days > 0 && `${days}d`,
      (hours > 0 || days > 0) && `${hours}h`,
      (minutes > 0 || hours > 0 || days > 0) && `${minutes}m`,
      `${seconds}s`,
    ];

    return sections.filter(Boolean).join(' ');
  }
}
