import { Pipe, PipeTransform } from '@angular/core';

/**
 * A pipe that sanitizes a string by removing any HTML markup
 * and returning only plain text
 * - Example: `<div>Hello World!</div>` to `Hello World!`
 */
@Pipe({
  name: 'decodeHtml',
})
export class DecodeHtmlPipe implements PipeTransform {
  transform(value: string | null): unknown {
    if (!value) {
      return '';
    }

    const text = document.createElement('textarea');
    text.innerHTML = value;

    return text.value;
  }
}
