import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

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
