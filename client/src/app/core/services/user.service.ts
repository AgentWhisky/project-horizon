import { computed, inject, Injectable, signal } from '@angular/core';
import { AuthInfo, AuthInfoPayload, UserInfo } from '../types/auth';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LoginCredentials, NewAccountCredentials } from '../types/login-credentials';
import { jwtDecode } from 'jwt-decode';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginDialogComponent } from '../../shared/dialogs/login-dialog/login-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private snackbar = inject(MatSnackBar);

  private apiUrl = environment.apiUrl;

  private _userInfo = signal<UserInfo | null>(null);
  readonly userInfo = this._userInfo.asReadonly();

  private _userRights = computed(() => new Set(this._userInfo()?.rights?.map((item) => item.internalName) || []));

  readonly isLoggedIn = computed(() => !!this._userInfo());

  loginDialog() {
    this.dialog.open(LoginDialogComponent, {
      width: '560px',
      panelClass: 'hz-dialog-container',
    });
  }

  async login(credentials: LoginCredentials): Promise<boolean> {
    if (!credentials || !credentials.username || !credentials.password) {
      return false;
    }

    try {
      const encodedCredentials = btoa(`${credentials.username}:${credentials.password}`);

      const headers = new HttpHeaders({
        Authorization: `Basic ${encodedCredentials}`,
      });

      const authInfo = await firstValueFrom(this.http.post<AuthInfo>(`${this.apiUrl}/login`, {}, { headers }));

      if (!authInfo || !authInfo.accessToken || !authInfo.refreshToken) {
        this.snackbar.open('Login failed', 'Close', { duration: 3000 });
        return false;
      }

      localStorage.setItem('accessToken', authInfo.accessToken);
      localStorage.setItem('refreshToken', authInfo.refreshToken);

      this.updateUserInfo(authInfo.accessToken);
      this.snackbar.open('Login successful', 'Close', { duration: 3000 });
      return true;
    } catch (error: any) {
      if (error?.status === 401) {
        this.snackbar.open('Invalid username or password', 'Close', { duration: 3000 });
      } else if (error?.status === 403) {
        this.snackbar.open('Account disabled', 'Close', { duration: 3000 });
      } else {
        this.snackbar.open('Login failed', 'Close', { duration: 3000 });
      }
      return false;
    }
  }

  async logout() {
    try {
      const userInfo = this._userInfo();
      if (!userInfo) {
        this.snackbar.open('You are not logged in', 'Close', { duration: 3000 });
        return;
      }

      await firstValueFrom(this.http.post<void>(`${this.apiUrl}/logout`, {}));

      this.snackbar.open('Successfully logged out', 'Close', { duration: 3000 });
    } finally {
      this.router.navigate(['/home']);
      this.clearUserInfo();
    }
  }

  async register(newAccountCredentials: NewAccountCredentials) {
    try {
      const authInfo = await firstValueFrom(this.http.post<AuthInfo>(`${this.apiUrl}/register`, newAccountCredentials));

      if (!authInfo || !authInfo.accessToken || !authInfo.refreshToken) {
        this.snackbar.open('Login failed', 'Close', { duration: 3000 });
        return false;
      }

      localStorage.setItem('accessToken', authInfo.accessToken);
      localStorage.setItem('refreshToken', authInfo.refreshToken);
      this.updateUserInfo(authInfo.accessToken);

      this.snackbar.open('Account registration successful', 'Close', { duration: 3000 });
      return true;
    } catch (error) {
      this.snackbar.open('Account registration failed', 'Close', { duration: 3000 });
      return false;
    }
  }

  /**
   * Function to update userInfo with the given access token payload
   * @param accessToken The given access token
   */
  updateUserInfo(accessToken: string) {
    if (!accessToken) {
      return;
    }

    const decodedToken: AuthInfoPayload = jwtDecode(accessToken);

    const { sub: userId, ...userPayload } = decodedToken;
    this._userInfo.set({ userId, ...userPayload });
  }

  clearUserInfo() {
    this._userInfo.set(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  hasRights(rights: string[]) {
    const userRights = this._userRights();
    if (!userRights) {
      return false;
    }

    return rights.some((right) => userRights.has(right));
  }
}
