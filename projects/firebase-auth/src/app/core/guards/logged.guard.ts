import { Signal, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AUTH_REDIRECT } from '@core/firebase-auth/constants';
import { AuthService } from '@core/firebase-auth/services/common/auth.service';
import { Observable, map } from 'rxjs';

export const loggedGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isLoggedIn: Observable<boolean> = authService.isLoggedIn$;

  return isLoggedIn.pipe(
    map((isLoggedIn) => {
      if (!isLoggedIn) {
        router.navigate(['auth'], {
          queryParams: { [AUTH_REDIRECT]: state.url },
        });
        return false;
      } else {
        return true;
      }
    })
  );
};
