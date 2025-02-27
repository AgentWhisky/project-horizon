import { computed, effect, inject, Injectable, OnInit, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { LoginDialogComponent } from '../dialogs/login-dialog/login-dialog.component';
import { firstValueFrom, tap } from 'rxjs';
import { TokenService } from './token.service';
import { LoginCredentials, NewAccountCredentials } from '../types/login-credentials';
import { AuthInfo, AuthInfoPayload, UserInfo } from '../types/auth';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private tokenService = inject(TokenService);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private snackbar = inject(MatSnackBar);

  private _accessToken = signal<string>('');
  private _refreshToken = signal<string>('');

  private _userInfo = signal<UserInfo | null>(null);
  readonly userInfo = this._userInfo.asReadonly();

  readonly isLoggedIn = computed(() => !!this._userInfo());

  constructor() {
    this.initAuth();

    effect(() => console.log(this._userInfo()));
  }

  private async initAuth() {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    try {
      if (accessToken) {
        const decodedToken: AuthInfoPayload = jwtDecode(accessToken);

        const isTokenExpired = Date.now() >= decodedToken.exp * 1000;

        if (decodedToken && !isTokenExpired) {
          this.updateUserInfo(accessToken);
        } else if (refreshToken) {
          const authInfo = await this.postAuthRefresh(accessToken, refreshToken);

          this._accessToken.set(authInfo.accessToken);
          this._refreshToken.set(authInfo.refreshToken);
          this.setAuth(authInfo);

          const userInfo: UserInfo = jwtDecode(authInfo.accessToken);
          this._userInfo.set(userInfo);
        } else {
          this.logout();
        }
      }
    } catch {}
  }

  loginDialog() {
    this.dialog.open(LoginDialogComponent, {
      width: '560px',
    });
  }

  async login(credentials: LoginCredentials): Promise<boolean> {
    if (!credentials || !credentials.username || !credentials.password) {
      return false;
    }

    try {
      const encodedCredentials = btoa(`${credentials.username}:${credentials.password}`);

      const authInfo = await this.tokenService.postLogin(encodedCredentials);

      if (!authInfo || !authInfo.accessToken || !authInfo.refreshToken) {
        this.snackbar.open('Login failed', 'Close', { duration: 3000 });
        return false;
      }

      this.updateAuth(authInfo);

      return true;
    } catch {
      return false;
    }
  }

  /*async login(credentials: LoginCredentials) {
    try {
      const authInfo = await this.postLogin(credentials);

      this._accessToken.set(authInfo.accessToken);
      this._refreshToken.set(authInfo.refreshToken);

      this.setAuth(authInfo);

      const userInfo: UserInfo = jwtDecode(authInfo.accessToken);
      this._userInfo.set(userInfo);

      this.snackbar.open('Login successful', 'Close', { duration: 3000 });
      return true;
    } catch (error) {
      this.snackbar.open('Login failed', 'Close', { duration: 3000 });
      return false;
    }
  }*/

  async createAccount(newAccountCredentials: NewAccountCredentials) {
    return false;
  }
  /* async createAccount(newAccountCredentials: NewAccountCredentials) {
    try {
      const authInfo = await this.postCreateAccount(newAccountCredentials);

      this._accessToken.set(authInfo.accessToken);
      this._refreshToken.set(authInfo.refreshToken);

      this.setAuth(authInfo);

      this.snackbar.open('Account registration successful', 'Close', { duration: 3000 });
      return true;
    } catch (error) {
      this.snackbar.open('Account registration failed', 'Close', { duration: 3000 });
      return false;
    }
  }*/

  async logout() {}
  /*async logout() {
    try {
      const userId = this.userInfo()?.userId;
      if (userId) {
        await this.postLogout(userId);
      } else {
        this.snackbar.open('You are not logged in', 'Close', { duration: 3000 });
      }

      this.snackbar.open('Successfully logged out', 'Close', { duration: 3000 });
    } catch {
      this.snackbar.open('You are not logged in', 'Close', { duration: 3000 });
    } finally {
      this.router.navigate(['/dashboard']);
      this._accessToken.set('');
      this._refreshToken.set('');
      this._userInfo.set(null);

      this.removeAuth();
    }
  }*/

  // *** Local Storage Functions ***

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
  }

  // *** Private Functions ***
  private updateAuth(authInfo: AuthInfo) {
    if (!authInfo || !authInfo.accessToken || !authInfo.refreshToken) {
      return;
    }

    localStorage.setItem('accessToken', authInfo.accessToken);
    localStorage.setItem('refreshToken', authInfo.refreshToken);

    this.updateUserInfo(authInfo.accessToken);
  }

  private updateUserInfo(accessToken: string) {
    if (!accessToken) {
      return;
    }

    const decodedToken: AuthInfoPayload = jwtDecode(accessToken);

    const { sub: userId, ...userPayload } = decodedToken;
    this._userInfo.set({ userId, ...userPayload });
  }

  // *** Endpoint Functions ***
}
