import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private _isLeftNavOpen = signal(this.getLeftNavState());
  readonly isLeftNavOpen = this._isLeftNavOpen.asReadonly();

  private _isSmallScreen = signal(window.innerWidth < SCREEN_MIN);
  readonly isSmallScreen = this._isSmallScreen.asReadonly();

  constructor() {
    window.onresize = () => {
      this.updateScreenSize();
    };
  }

  // *** Left Navigation Menu State (Open/Closed) ***
  toggleLeftNav() {
    const isOpen = !this._isLeftNavOpen();

    this._isLeftNavOpen.set(isOpen);
    this.setLeftNavState(isOpen);
  }

  closeLeftNav() {
    this._isLeftNavOpen.set(false);
    this.setLeftNavState(false);
  }

  private setLeftNavState(isOpen: boolean) {
    localStorage.setItem('leftNavState', JSON.stringify(isOpen));
  }

  private getLeftNavState() {
    return JSON.parse(localStorage.getItem('leftNavState') || 'false');
  }

  // *** Navigation for Screen Size ***
  private updateScreenSize() {
    this._isSmallScreen.set(window.innerWidth < SCREEN_MIN);
  }

}

/** Small Screen Size Limit */
const SCREEN_MIN = 1100;
