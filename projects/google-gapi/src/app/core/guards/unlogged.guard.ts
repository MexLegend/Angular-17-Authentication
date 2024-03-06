import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@core/google-gapi/services/common/auth.service';

export const unloggedGuard: CanActivateFn = (_, __) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isLoggedIn = authService.isLoggedIn();

  if (isLoggedIn) {
    return router.navigateByUrl(router.url);
  } else {
    return true;
  }
};
