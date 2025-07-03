import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'keyword',
})
export class KeywordPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) {
      return '';
    }

    return value.split(' ').filter(Boolean).join(', ');
  }
}
