import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

import { environment } from 'environments/environment';
import { APP_ROUTES } from '../constants';

export const devGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const isProduction = environment.production;

  if (isProduction) {
    router.navigate([APP_ROUTES.LINK_LIBRARY]);
    return false;
  }

  return true;
};
