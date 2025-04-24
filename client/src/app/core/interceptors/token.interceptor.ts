import { HttpInterceptorFn } from '@angular/common/http';
import { ACCESS_TOKEN } from '../constants/storage-keys.constant';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const excludedUrls = ['/api/login', '/api/refresh'];

  if (excludedUrls.some((url) => req.url.includes(url))) {
    return next(req);
  }

  const accessToken = localStorage.getItem(ACCESS_TOKEN);

  if (accessToken) {
    const authRequest = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + accessToken),
    });
    return next(authRequest);
  }

  return next(req);
};
