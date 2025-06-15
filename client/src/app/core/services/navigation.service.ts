import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private _isLeftNavOpen = signal(this.getLeftNavState());
  readonly isLeftNavOpen = this._isLeftNavOpen.asReadonly();

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
}
