import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { LoginDialogComponent } from '../dialogs/login-dialog/login-dialog.component';
import { firstValueFrom } from 'rxjs';
import { TokenService } from './token.service';
import { LoginCredentials, NewAccountCredentials } from '../types/login-credentials';
import { AuthInfo } from '../types/auth';
import { DialogRef } from '@angular/cdk/dialog';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private tokenService = inject(TokenService);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private snackbar = inject(MatSnackBar);

  private _authInfo = signal<AuthInfo | null>(this.getAuth());
  readonly authInfo = this._authInfo.asReadonly();

  readonly isLoggedIn = computed(() => !!this._authInfo());

  constructor() {
    effect(() => console.log(this.authInfo()));
  }

  loginDialog() {
    this.dialog.open(LoginDialogComponent, {
      width: '560px',
    });
  }

  async login(credentials: LoginCredentials) {
    try {
      const authInfo = await this.authenticate(credentials);
      this._authInfo.set(authInfo);
      this.setAuth(authInfo);

      this.snackbar.open('Login successful', 'Close', { duration: 3000 });
      return true;
    } catch (error) {
      this.snackbar.open('Login failed', 'Close', { duration: 3000 });
      return false;
    }
  }

  async createAccount(newAccountCredentials: NewAccountCredentials) {
    try {
      const authInfo = await this.postCreateAccount(newAccountCredentials);
      this._authInfo.set(authInfo);
      this.setAuth(authInfo);

      this.snackbar.open('Account registration successful', 'Close', { duration: 3000 });
      return true;
    } catch (error) {
      this.snackbar.open('Account registration failed', 'Close', { duration: 3000 });
      return false;
    }
  }

  logout() {
    this.router.navigate(['/dashboard']);
    this._authInfo.set(null);
    this.removeAuth();
  }

  private setAuth(authInfo: AuthInfo) {
    localStorage.setItem('accessToken', JSON.stringify(authInfo.accessToken));
    localStorage.setItem('refreshToken', JSON.stringify(authInfo.refreshToken));
    localStorage.setItem('expiresIn', JSON.stringify(authInfo.expiresIn));
    localStorage.setItem('tokenType', JSON.stringify(authInfo.tokenType));
  }

  private getAuth(): AuthInfo | null {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    const expiresIn = localStorage.getItem('expiresIn');
    const tokenType = localStorage.getItem('tokenType');

    if (!accessToken || !refreshToken || !expiresIn || !tokenType) {
      return null;
    }

    return {
      accessToken: JSON.parse(accessToken),
      refreshToken: JSON.parse(refreshToken),
      expiresIn: JSON.parse(expiresIn),
      tokenType: JSON.parse(tokenType),
    };
  }

  private removeAuth() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('expiresIn');
    localStorage.removeItem('tokenType');
  }

  private async authenticate(credentials: LoginCredentials) {
    const authInfo$ = this.tokenService.postWithTokenRefresh<AuthInfo>('/auth/login', credentials);
    return firstValueFrom(authInfo$);
  }

  private async postCreateAccount(newAccountCredentials: NewAccountCredentials) {
    const authInfo$ = this.tokenService.postWithTokenRefresh<AuthInfo>('/auth/register', newAccountCredentials);
    return firstValueFrom(authInfo$);
  }
}
