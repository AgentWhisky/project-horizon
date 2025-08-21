import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthInfo, AuthInfoPayload } from '../models/auth';
import { firstValueFrom, from, mergeMap, of, retry, throwError } from 'rxjs';
import { UserService } from './user.service';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private http = inject(HttpClient);
  private userService = inject(UserService);

  private apiUrl = environment.apiUrl;
  private refreshInProgress: Promise<AuthInfo> | null = null;

  // *** HTTP ACTIONS ***
  getWithTokenRefresh<T>(url: string, options?: {}) {
    return this.http.get<T>(`${this.apiUrl}${url}`, options).pipe(
      retry({
        count: 1,
        delay: (error) => {
          if (error instanceof HttpErrorResponse && error.status === 401) {
            return from(this.refresh()).pipe(mergeMap(() => of(null)));
          }
          return throwError(() => error);
        },
      })
    );
  }

  putWithTokenRefresh<T>(url: string, body: any, options?: {}) {
    return this.http.put<T>(`${this.apiUrl}${url}`, body, options).pipe(
      retry({
        count: 1,
        delay: (error) => {
          if (error instanceof HttpErrorResponse && error.status === 401) {
            return from(this.refresh()).pipe(mergeMap(() => of(null)));
          }
          return throwError(() => error);
        },
      })
    );
  }

  postWithTokenRefresh<T>(url: string, body: any, options?: {}) {
    return this.http.post<T>(`${this.apiUrl}${url}`, body, options).pipe(
      retry({
        count: 1,
        delay: (error) => {
          if (error instanceof HttpErrorResponse && error.status === 401) {
            return from(this.refresh()).pipe(mergeMap(() => of(null)));
          }
          return throwError(() => error);
        },
      })
    );
  }

  deleteWithTokenRefresh<T>(url: string, options?: {}) {
    return this.http.delete<T>(`${this.apiUrl}${url}`, options).pipe(
      retry({
        count: 1,
        delay: (error) => {
          if (error instanceof HttpErrorResponse && error.status === 401) {
            return from(this.refresh()).pipe(mergeMap(() => of(null)));
          }
          return throwError(() => error);
        },
      })
    );
  }

  async onInitUser() {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    if (!accessToken || !refreshToken) {
      this.userService.clearUserInfo();
      return;
    }

    try {
      const decodedToken: AuthInfoPayload = jwtDecode(accessToken);
      const isExpired = Date.now() >= decodedToken.exp * 1000;

      if (decodedToken && !isExpired) {
        this.userService.updateUserInfo(accessToken); // Continue as logged in
      } else {
        await this.refresh(); // Attempt to refresh token
      }
    } catch {
      this.userService.clearUserInfo();
    }
  }

  refresh(): Promise<AuthInfo> {
    if (this.refreshInProgress) {
      return this.refreshInProgress;
    }

    this.refreshInProgress = new Promise(async (resolve, reject) => {
      try {
        const refreshToken = localStorage.getItem('refreshToken');

        if (!refreshToken) {
          this.userService.clearUserInfo();
          throw new Error('No refresh token');
        }

        const headers = new HttpHeaders().set('Authorization', `RefreshToken ${refreshToken}`);
        const authInfo = await firstValueFrom(this.http.post<AuthInfo>(`${this.apiUrl}/refresh`, {}, { headers }));

        if (!authInfo || !authInfo.accessToken || !authInfo.refreshToken) {
          this.userService.clearUserInfo();
          throw new Error('Refresh failed');
        }

        localStorage.setItem('accessToken', authInfo.accessToken);
        localStorage.setItem('refreshToken', authInfo.refreshToken);
        this.userService.updateUserInfo(authInfo.accessToken);

        resolve(authInfo);
      } catch (error) {
        console.log('ERROR');
        this.userService.clearUserInfo();
        reject(error);
      } finally {
        this.refreshInProgress = null;
      }
    });

    return this.refreshInProgress;
  }
}
