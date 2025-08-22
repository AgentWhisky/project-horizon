import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

import { UserService } from '../services/user.service';

export const AuthGuard: CanActivateFn = async (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);

  if (!userService.isLoggedIn()) {
    router.navigate(['/home']);
    return false;
  }

  const requiredRights: string[] = route?.data['requiredRights'];
  if (requiredRights) {
    return userService.hasRights(requiredRights);
  }

  return true;
};
