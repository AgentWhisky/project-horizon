import { Pipe, PipeTransform } from '@angular/core';

/**
 * A pipe that splits a string into comma separated keywords
 * -Example: `apple banana orange` to `apple, banana, orange`
 */
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
