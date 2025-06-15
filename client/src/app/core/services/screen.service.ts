import { inject, Injectable, NgZone, OnDestroy, signal } from '@angular/core';
import { SMALL_SCREEN_SIZE, MOBILE_SCREEN_SIZE, SCROLL_Y } from '../constants/screen-values.constant';

@Injectable({
  providedIn: 'root',
})
export class ScreenService implements OnDestroy {
  private zone = inject(NgZone);

  private _isSmallScreen = signal(this.checkSize(SMALL_SCREEN_SIZE));
  readonly isSmallScreen = this._isSmallScreen.asReadonly();

  private _isMobileScreen = signal(this.checkSize(MOBILE_SCREEN_SIZE));
  readonly isMobileScreen = this._isMobileScreen.asReadonly();

  private _isScrolled = signal(this.checkScroll());
  readonly isScrolled = this._isScrolled.asReadonly();

  private readonly resizeListener = () => {
    this.zone.run(() => this.updateScreenSize());
  };

  private readonly scrollListener = () => {
    this.zone.run(() => this.updateScrollState);
  };

  constructor() {
    window.addEventListener('resize', this.resizeListener);
    window.addEventListener('scroll', this.scrollListener);
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.resizeListener);
    window.removeEventListener('scroll', this.scrollListener);
  }

  private updateScreenSize() {
    this._isSmallScreen.set(this.checkSize(SMALL_SCREEN_SIZE));
    this._isMobileScreen.set(this.checkSize(MOBILE_SCREEN_SIZE));
  }

  private updateScrollState() {
    this._isScrolled.set(this.checkScroll());
  }

  private checkSize(threshold: number) {
    return window.innerWidth < threshold;
  }

  private checkScroll() {
    return window.scrollY > SCROLL_Y;
  }
}
