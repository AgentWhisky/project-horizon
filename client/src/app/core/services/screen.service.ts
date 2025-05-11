import { inject, Injectable, NgZone, OnDestroy, signal } from '@angular/core';
import { MOBILE_SCREEN_SIZE, SCROLL_Y, SMALL_SCREEN_SIZE } from '../constants/screen-values.constant';

@Injectable({
  providedIn: 'root',
})
export class ScreenService implements OnDestroy {
  private zone = inject(NgZone);

  private _isSmallScreen = signal(window.innerWidth < SMALL_SCREEN_SIZE);
  readonly isSmallScreen = this._isSmallScreen.asReadonly();

  private _isMobileScreen = signal(window.innerWidth < MOBILE_SCREEN_SIZE);
  readonly isMobileScreen = this._isMobileScreen.asReadonly();

  private _isScrolled = signal(window.scrollY > SCROLL_Y);
  readonly isScrolled = this._isScrolled.asReadonly();

  private resizeListener = () => {
    this.zone.run(() => this.updateScreenSize());
  };

  private scrollListener = () => {
    this.zone.run(() => this.onScroll());
  };

  constructor() {
    window.addEventListener('resize', this.resizeListener);
    window.addEventListener('scroll', this.scrollListener);
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.resizeListener);
    window.removeEventListener('scroll', this.scrollListener);
  }

  // *** Navigation for Screen Size ***
  private updateScreenSize() {
    this._isSmallScreen.set(window.innerWidth < SMALL_SCREEN_SIZE);
    this._isMobileScreen.set(window.innerWidth < MOBILE_SCREEN_SIZE);
  }

  private onScroll() {
    this._isScrolled.set(window.scrollY > SCROLL_Y);
  }
}
