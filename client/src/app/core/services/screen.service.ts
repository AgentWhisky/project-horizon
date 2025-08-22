import { inject, Injectable, NgZone, OnDestroy, signal } from '@angular/core';
import { SCREEN_BREAKPOINTS } from '@hz/constants';

@Injectable({
  providedIn: 'root',
})
export class ScreenService implements OnDestroy {
  private zone = inject(NgZone);

  private _isSmallScreen = signal(this.checkSize(SCREEN_BREAKPOINTS.SMALL));
  readonly isSmallScreen = this._isSmallScreen.asReadonly();

  private _isMobileScreen = signal(this.checkSize(SCREEN_BREAKPOINTS.MOBILE));
  readonly isMobileScreen = this._isMobileScreen.asReadonly();

  private readonly resizeListener = () => {
    this.zone.run(() => this.updateScreenSize());
  };

  constructor() {
    window.addEventListener('resize', this.resizeListener);
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.resizeListener);
  }

  private updateScreenSize() {
    this._isSmallScreen.set(this.checkSize(SCREEN_BREAKPOINTS.SMALL));
    this._isMobileScreen.set(this.checkSize(SCREEN_BREAKPOINTS.MOBILE));
  }

  private checkSize(threshold: number) {
    return window.innerWidth < threshold;
  }
}
