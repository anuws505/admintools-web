import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenService } from './authen.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authenService = inject(AuthenService);
  const router = inject(Router);

  if (authenService.loggedIn()) {
    return true;
  } else {
    router.navigate(['/']);
    return false;
  }
};
