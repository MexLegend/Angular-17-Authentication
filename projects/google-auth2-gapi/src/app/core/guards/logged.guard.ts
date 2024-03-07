import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AUTH_REDIRECT } from '@core/google-auth2-gapi/constants';
import { AuthService } from '@core/google-auth2-gapi/services/common/auth.service';

export const loggedGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const selectIsLoggedIn = authService.selectIsLoggedIn();

  if (!selectIsLoggedIn) {
    return router.navigate(['auth'], {
      queryParams: { [AUTH_REDIRECT]: state.url },
    });
  } else {
    return true;
  }
};
