import { Pipe, PipeTransform } from '@angular/core';

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
