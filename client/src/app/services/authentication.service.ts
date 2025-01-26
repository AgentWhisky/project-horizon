import { inject, Injectable, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginDialogComponent } from '../dialogs/login-dialog/login-dialog.component';
import { filter, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private _isLoggedIn = signal(this.getAuth());
  readonly isLoggedIn = this._isLoggedIn.asReadonly();

  private dialog = inject(MatDialog);

  constructor() {}

  login() {
    this.dialog
      .open(LoginDialogComponent, {
        width: '560px',
      })
      .afterClosed()
      .pipe(
        filter((result) => result && result.status === true),
        tap((result) => console.log(result))
      )
      .subscribe();
  }

  logout() {
    this._isLoggedIn.set(false);
    this.removeAuth();
  }

  handleLogin(username: string, password: string) {
    console.log(`Username: ${username}, Password: ${password}`);

    this._isLoggedIn.set(true);
    this.setAuth();
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
