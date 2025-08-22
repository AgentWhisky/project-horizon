import { HttpInterceptorFn } from '@angular/common/http';
import { STORAGE_KEYS, TOKEN_EXCLUDED_ENDPOINTS } from '@hz/constants';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  if (TOKEN_EXCLUDED_ENDPOINTS.has(req.url)) {
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
