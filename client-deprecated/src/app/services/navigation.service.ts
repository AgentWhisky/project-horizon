import { effect, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private _isLeftNavOpen = signal(this.getLeftNavState());
  readonly isLeftNavOpen = this._isLeftNavOpen.asReadonly();

  private _isSmallScreen = signal(this.getScreenSize());
  readonly isSmallScreen = this._isSmallScreen.asReadonly();

  constructor() {
    window.onresize = () => {
      this.updateScreenSize();
    };

    effect(() => console.log('isOpenLeftNav: ', this._isLeftNavOpen()));
    effect(() => console.log('isSmallScreen: ', this._isSmallScreen()));
  }

  // *** Left Navigation Menu ***
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
    const screenSize = window.innerWidth < 1100;

    this._isSmallScreen.set(screenSize);
    this.setScreenSize(screenSize);
  }

  private setScreenSize(smallScreen: boolean) {
    localStorage.setItem('smallScreen', JSON.stringify(smallScreen));
  }

  private getScreenSize() {
    return JSON.parse(localStorage.getItem('smallScreen') || 'false');
  }
}
