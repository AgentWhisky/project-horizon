import { inject, Injectable, NgZone, signal } from '@angular/core';
import { SMALL_SCREEN_SIZE } from '../constants/screen-breakpoints.constant';

@Injectable({
  providedIn: 'root',
})
export class ScreenService {
  private zone = inject(NgZone);

  private _isSmallScreen = signal(window.innerWidth < SMALL_SCREEN_SIZE);
  readonly isSmallScreen = this._isSmallScreen.asReadonly();

  constructor() {
    window.addEventListener('resize', () => {
      this.zone.run(() => this.updateScreenSize());
    });
  }

  // *** Navigation for Screen Size ***
  private updateScreenSize() {
    this._isSmallScreen.set(window.innerWidth < SMALL_SCREEN_SIZE);
  }
}
