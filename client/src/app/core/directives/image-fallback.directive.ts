import { Directive, HostListener, input, signal } from '@angular/core';
import { ASSET_URLS } from '@hz/core/constants';

/**
 * A directive to supply a fallback image src on an img error
 * - `fallbackSrc` is fallback src url
 */
@Directive({ selector: 'img[fallbackSrc]' })
export class ImageFallbackDirective {
  readonly fallbackSrc = input<string>(ASSET_URLS.DEFAULT_ICON);
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
