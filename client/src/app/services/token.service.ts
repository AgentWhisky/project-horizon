import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, OnInit, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { AuthInfo, AuthInfoPayload, UserInfo } from '../types/auth';
import { firstValueFrom } from 'rxjs';
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
    return this.http.get<T>(`${this.apiUrl}${url}`, options);
  }

  putWithTokenRefresh<T>(url: string, body: any, options?: {}) {
    return this.http.put<T>(`${this.apiUrl}${url}`, body, options);
  }

  postWithTokenRefresh<T>(url: string, body: any, options?: {}) {
    return this.http.post<T>(`${this.apiUrl}${url}`, body, options);
  }

  deleteWithTokenRefresh<T>(url: string, options?: {}) {
    return this.http.delete<T>(`${this.apiUrl}${url}`, options);
  }

  async refresh() {
    const refreshToken = localStorage.getItem('refreshToken');

    const authInfo = await firstValueFrom(this.http.post<AuthInfo>(`${this.apiUrl}/refresh`, { refreshToken }));

    // RETRY?
    if (!authInfo || !authInfo.accessToken || !authInfo.refreshToken) {
      console.log('REFRESH FAILURE - NO RETRY');
      this.userService.clearUserInfo();
      return;
    }

    localStorage.setItem('accessToken', authInfo.accessToken);
    localStorage.setItem('refreshToken', authInfo.refreshToken);

    this.userService.updateUserInfo(authInfo.accessToken);
  }
}
