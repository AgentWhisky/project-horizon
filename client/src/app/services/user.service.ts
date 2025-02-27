import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { AuthInfo, AuthInfoPayload, UserInfo } from '../types/auth';
import { TokenService } from './token.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LoginDialogComponent } from '../dialogs/login-dialog/login-dialog.component';
import { LoginCredentials, NewAccountCredentials } from '../types/login-credentials';
import { jwtDecode } from 'jwt-decode';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

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

      const headers = new HttpHeaders({
        Authorization: `Basic ${encodedCredentials}`,
      });

      const authInfo = await firstValueFrom(this.http.post<AuthInfo>(`${this.apiUrl}/login`, {}, { headers }));

      console.log(authInfo);
      

      if (!authInfo || !authInfo.accessToken || !authInfo.refreshToken) {
        this.snackbar.open('Login failed', 'Close', { duration: 3000 });
        return false;
      }

      localStorage.setItem('accessToken', authInfo.accessToken);
      localStorage.setItem('refreshToken', authInfo.refreshToken);

      this.updateUserInfo(authInfo.accessToken);
      this.snackbar.open('Login successful', 'Close', { duration: 3000 });
      return true;
    } catch {
      this.snackbar.open('Login failed', 'Close', { duration: 3000 });
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

      await firstValueFrom(this.http.post<void>(`${this.apiUrl}/logout/${userInfo.userId}`, userInfo.jti));

      this.snackbar.open('Successfully logged out', 'Close', { duration: 3000 });
    } finally {
      this.router.navigate(['/dashboard']);
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

  private async initUser() {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
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
}
