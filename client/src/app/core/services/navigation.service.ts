import { Injectable, signal } from '@angular/core';

import { STORAGE_KEYS } from '../constants';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private _isLeftNavOpen = signal<boolean>(this.loadLeftNavState());
  readonly isLeftNavOpen = this._isLeftNavOpen.asReadonly();

  toggleLeftNav() {
    const isOpen = !this._isLeftNavOpen();

    this._isLeftNavOpen.set(isOpen);
    this.saveLeftNavState(isOpen);
  }

  closeLeftNav() {
    this._isLeftNavOpen.set(false);
    this.saveLeftNavState(false);
  }

  private saveLeftNavState(isOpen: boolean) {
    localStorage.setItem(STORAGE_KEYS.LEFT_NAV.STATE, JSON.stringify(isOpen));
  }

  private loadLeftNavState() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.LEFT_NAV.STATE) || 'false');
  }
}
