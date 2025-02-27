import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { AuthInfoPayload, UserInfo } from '../types/auth';
import { TokenService } from './token.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LoginDialogComponent } from '../dialogs/login-dialog/login-dialog.component';
import { LoginCredentials } from '../types/login-credentials';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private tokenService = inject(TokenService);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private snackbar = inject(MatSnackBar);

  private _userInfo = signal<UserInfo | null>(null);
  readonly userInfo = this._userInfo.asReadonly();

  readonly isLoggedIn = computed(() => !!this._userInfo());

  constructor() {
    this.initUser();

    effect(() => console.log(this._userInfo()));
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

      this.updateUserInfo(authInfo.accessToken);
      this.snackbar.open('Login successful', 'Close', { duration: 3000 });
      return true;
    } catch {
      this.snackbar.open('Login failed', 'Close', { duration: 3000 });
      return false;
    }
  }

  // *** Private Functions ***
  private async initUser() {}

  /**
   * Function to update userInfo with the given access token payload
   * @param accessToken The given access token
   */
  private updateUserInfo(accessToken: string) {
    if (!accessToken) {
      return;
    }

    const decodedToken: AuthInfoPayload = jwtDecode(accessToken);

    const { sub: userId, ...userPayload } = decodedToken;
    this._userInfo.set({ userId, ...userPayload });
  }
}
