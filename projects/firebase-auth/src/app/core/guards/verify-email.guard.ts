import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { KEY_STORAGE } from '@core/firebase-auth/constants';
import { WebStorageService } from '@core/firebase-auth/services/utils/web-storage.service';
import { FirebaseAuthService } from '@core/firebase-auth/services/utils/firebase/firebase-auth.service';

export const verifyEmailGuard: CanActivateFn = (route, state) => {
  const firebaseAuthService = inject(FirebaseAuthService);
  const webStorageService = inject(WebStorageService);
  const router = inject(Router);

  webStorageService.useStorage('session');
  const userEmail = webStorageService.getItem<string>(
    KEY_STORAGE.DATA_USER_VERIFY_EMAIL
  );
  const isLoggedIn = firebaseAuthService._auth.currentUser;

  if (!userEmail && isLoggedIn) {
    router.navigateByUrl(router.url);
    return false;
  } else {
    return true;
  }
};
