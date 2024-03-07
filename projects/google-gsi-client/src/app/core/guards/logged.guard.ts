import { Signal, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AUTH_REDIRECT } from '@core/google-gsi-client/constants';
import { AuthService } from '@core/google-gsi-client/services/common/auth.service';

export const loggedGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isLoggedIn: Signal<boolean> = authService.$isLoggedIn;

  if (!isLoggedIn()) {
    return router.navigate(['auth'], {
      queryParams: { [AUTH_REDIRECT]: state.url },
    });
  } else {
    return true;
  }
};
