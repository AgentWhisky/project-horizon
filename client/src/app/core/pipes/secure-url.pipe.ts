import { Pipe, PipeTransform } from '@angular/core';

/**
 * A pipe that converts a URL is always using https instead of http.
 * - Converts `http://` to `https://`
 * - Returns empty string if url is null or undefined
 */
@Pipe({
  name: 'secureUrl',
})
export class SecureUrlPipe implements PipeTransform {
  transform(url: string): string {
    if (!url) {
      return '';
    }

    return url?.startsWith('http://') ? url.replace('http://', 'https://') : url;
  }
}
