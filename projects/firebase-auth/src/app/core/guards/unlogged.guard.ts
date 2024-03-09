import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@core/firebase-auth/services/common/auth.service';
import { Observable, map } from 'rxjs';

export const unloggedGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isLoggedIn: Observable<boolean> = authService.isLoggedIn$;

  return isLoggedIn.pipe(
    map((isLoggedIn) => {
      if (isLoggedIn) {
        router.navigateByUrl(router.url);
        return false;
      } else {
        return true;
      }
    })
  );
};
