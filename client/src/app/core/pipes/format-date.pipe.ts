import { inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';
import { formatDate } from '@angular/common';

import { REGEX } from '../constants';

/**
 * Formats all found ISO date strings within a larger text string.
 */
@Pipe({
  name: 'formatDate',
})
export class FormatDatePipe implements PipeTransform {
  private locale = inject(LOCALE_ID);

  transform(text: string, format: string = 'M/d/yyyy, h:mm a'): string {
    if (!text || typeof text !== 'string') {
      return text;
    }

    return text.replace(REGEX.ISO_DATE, (match) => {
      try {
        const date = new Date(match);
        return formatDate(date, format, this.locale) || match;
      } catch {
        return match;
      }
    });
  }
}
