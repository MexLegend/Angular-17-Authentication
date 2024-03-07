import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@core/google-auth2-gapi/services/common/auth.service';

export const unloggedGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const selectIsLoggedIn = authService.selectIsLoggedIn();

  if (selectIsLoggedIn) {
    return router.navigateByUrl(router.url);
  } else {
    return true;
  }
};
