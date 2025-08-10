import { Directive, HostListener, input, signal } from '@angular/core';

@Directive({ selector: 'img[fallbackSrc]' })
export class ImageFallbackDirective {
  readonly fallbackSrc = input('assets/icons/default-favicon.ico');
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
