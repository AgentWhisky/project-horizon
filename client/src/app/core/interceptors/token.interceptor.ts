import { HttpInterceptorFn } from '@angular/common/http';
import { STORAGE_KEYS, TOKEN_EXCLUDED_ENDPOINTS } from '@hz/core/constants';
import { environment } from 'environments/environment';

/**
 * An interceptor that appends an authorization header to all http requests
 * except specifically excluded endpoints
 * - Appends an Authorization Bearer header with the current access token
 * - Excluded endpoints are set in core constants
 */
export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const apiUrl = environment.apiUrl;
  const parsed = new URL(req.url, window.location.origin);

  // Ignore non-api calls
  if (!parsed.href.startsWith(apiUrl)) {
    return next(req);
  }

  // Ignore specific endpoints
  const path = parsed.pathname;
  if (TOKEN_EXCLUDED_ENDPOINTS.has(path)) {
    return next(req);
  }

  const accessToken = localStorage.getItem(STORAGE_KEYS.AUTH.ACCESS_TOKEN);

  if (accessToken) {
    const authRequest = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + accessToken),
    });
    return next(authRequest);
  }

  return next(req);
};
