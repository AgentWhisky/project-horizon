import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'secureUrl',
})
export class SecureUrlPipe implements PipeTransform {
  transform(url: string): string {
    return url?.startsWith('http:') ? url.replace('http:', 'https:') : url;
  }
}
