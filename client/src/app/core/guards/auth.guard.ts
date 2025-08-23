import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

import { APP_ROUTES } from '../constants';
import { UserService } from '../services';

const ROUTE_REQUIRED_RIGHTS = 'requiredRights' as const;

/**
 * A guard to prevent route activation when a user is not logged in
 * and does not posses required rights
 *
 * - `requiredRights` are supplied in the route data
 * - If no `requiredRights` are supplied, only requires the user to be logged in
 */
export const authGuard: CanActivateFn = async (route, _state) => {
  const userService = inject(UserService);
  const router = inject(Router);

  if (!userService.isLoggedIn()) {
    router.navigate([APP_ROUTES.LINK_LIBRARY]);
    return false;
  }

  const requiredRights: string[] = route?.data[ROUTE_REQUIRED_RIGHTS];
  if (requiredRights) {
    return userService.hasRights(requiredRights);
  }

  return true;
};
