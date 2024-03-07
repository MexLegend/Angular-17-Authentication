import { Signal, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@core/google-gsi-client/services/common/auth.service';

export const unloggedGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isLoggedIn: Signal<boolean> = authService.$isLoggedIn;

  if (isLoggedIn()) {
    return router.navigateByUrl(router.url);
  } else {
    return true;
  }
};
