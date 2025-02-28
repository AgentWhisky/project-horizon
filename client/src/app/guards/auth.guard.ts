import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { UserService } from '../services/user.service';
import { TokenService } from '../services/token.service';

export const AuthGuard: CanActivateFn = async (route, state) => {
  const tokenService = inject(TokenService);
  const userService = inject(UserService);
  const router = inject(Router);

  if (userService.isLoggedIn()) {
    return true;
  }

  console.log('NOT LOGGED IN - AUTH GUARD');

  router.navigate(['/dashboard']);
  return false;
};
