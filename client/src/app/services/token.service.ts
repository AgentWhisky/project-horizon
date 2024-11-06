import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getWithTokenRefresh<T>(url: string, options?: {}) {
    return this.http.get<T>(`${this.apiUrl}${url}`, options);
  }

  postWithTokenRefresh<T>(url: string, payload: any, options?: {}) {
    return this.http.post<T>(`${this.apiUrl}${url}`, payload, options);
  }
}
