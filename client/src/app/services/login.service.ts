import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private _isLoggedIn = signal(false);
  readonly isLoggedIn = this._isLoggedIn.asReadonly();

  constructor() {}

  login() {
    this._isLoggedIn.set(true);
  }

  logout() {
    this._isLoggedIn.set(false);
  }
}
