import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { AuthInfo, AuthInfoPayload } from '../types/auth';
import { catchError, Observable, of, retry, tap, throwError } from 'rxjs';
import { UserService } from './user.service';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private http = inject(HttpClient);
  private userService = inject(UserService);

  private apiUrl = environment.apiUrl;

  // General HTTP Actions
  getWithTokenRefresh<T>(url: string, options?: {}) {
    return this.http.get<T>(`${this.apiUrl}${url}`, options).pipe(
      retry({
        count: 1,
        delay: (error) => {
          if (error instanceof HttpErrorResponse && error.status === 401) {
            return this.refresh();
          }
          return of(error);
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
            return this.refresh();
          }
          return of(error);
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
            return this.refresh();
          }
          return of(error);
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
            return this.refresh();
          }
          return of(error);
        },
      })
    );
  }

  onInitUser() {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    try {
      if (accessToken && refreshToken) {
        const decodedToken: AuthInfoPayload = jwtDecode(accessToken);
        const isExpired = Date.now() >= decodedToken.exp * 1000;

        if (decodedToken && !isExpired) {
          this.userService.updateUserInfo(accessToken); // Continue as logged in
        } else if (decodedToken) {
          this.refresh(); // Attempt to refresh token
        } else {
          this.userService.clearUserInfo(); // Clear login
        }
      }
    } catch {}
  }

  refresh(): Observable<AuthInfo> {
    console.log('REFRESH TOKEN');
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      this.userService.clearUserInfo();
      return throwError(() => new Error('No refresh token'));
    }

    const headers = new HttpHeaders().set('Authorization', `RefreshToken ${refreshToken}`);

    return this.http.post<AuthInfo>(`${this.apiUrl}/refresh`, {}, { headers }).pipe(
      tap((authInfo) => {
        if (!authInfo || !authInfo.accessToken || !authInfo.refreshToken) {
          this.userService.clearUserInfo();
          throw new Error('Invalid Auth Response');
        }

        localStorage.setItem('accessToken', authInfo.accessToken);
        localStorage.setItem('refreshToken', authInfo.refreshToken);
        this.userService.updateUserInfo(authInfo.accessToken);
      }),
      catchError((error) => {
        this.userService.clearUserInfo();
        return throwError(() => error);
      })
    );
  }
}
