import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatArray',
})
export class FormatArrayPipe implements PipeTransform {
  transform<T>(array: T[], field: keyof T): unknown {
    if (!Array.isArray(array) || array.length === 0) {
      return '';
    }
    return array
      .map((item) => item[field])
      .sort()
      .join(', ');
  }
}
