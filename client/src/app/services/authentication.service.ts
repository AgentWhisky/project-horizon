import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private _isLoggedIn = signal(this.getAuth());
  readonly isLoggedIn = this._isLoggedIn.asReadonly();

  constructor() {}

  login() {
    this._isLoggedIn.set(true);
    this.setAuth();
  }

  logout() {
    this._isLoggedIn.set(false);
    this.removeAuth();
  }

  private setAuth() {
    localStorage.setItem('authToken', JSON.stringify(this._isLoggedIn()));
  }

  private getAuth() {
    return JSON.parse(localStorage.getItem('authToken') || 'false');
  }

  private removeAuth() {
    localStorage.removeItem('authToken');
  }
}
