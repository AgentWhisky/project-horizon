import { Directive, HostListener, input, signal } from '@angular/core';
import { ASSET_URLS } from '@hz/constants';

@Directive({ selector: 'img[fallbackSrc]' })
export class ImageFallbackDirective {
  readonly fallbackSrc = input(ASSET_URLS.DEFAULT_ICON);
  private fallbackApplied = signal<boolean>(false);

  @HostListener('error', ['$event'])
  onError(e: Event) {
    if (this.fallbackApplied()) {
      return;
    }

    this.fallbackApplied.set(true);
    (e.target as HTMLImageElement).src = this.fallbackSrc();
  }
}
