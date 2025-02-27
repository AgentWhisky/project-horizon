import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { AuthInfo } from '../types/auth';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  async postLogin(encodedCredentials: string) {
    const headers = new HttpHeaders({
      Authorization: `Basic ${encodedCredentials}`,
    });

    const authInfo = await firstValueFrom(this.http.post<AuthInfo>(`${this.apiUrl}/login`, {}, { headers }))

    if (!authInfo || !authInfo.accessToken || !authInfo.refreshToken) {
      return null;
    }

    localStorage.setItem('accessToken', authInfo.accessToken);
    localStorage.setItem('refreshToken', authInfo.refreshToken);

    return authInfo;
  }

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
}
