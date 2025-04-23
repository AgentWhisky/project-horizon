import { inject, Injectable, signal } from '@angular/core';
import { ScreenService } from './screen.service';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private _isLeftNavOpen = signal(this.getLeftNavState());
  readonly isLeftNavOpen = this._isLeftNavOpen.asReadonly();

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
}
