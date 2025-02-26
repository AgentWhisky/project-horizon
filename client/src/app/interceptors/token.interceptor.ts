import { HttpInterceptorFn } from '@angular/common/http';
import { ACCESS_TOKEN } from '../constants';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const accessToken = localStorage.getItem(ACCESS_TOKEN);

  if (accessToken) {
    const authRequest = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + accessToken),
    });
    return next(authRequest);
  }

  return next(req);
};
