import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { KEY_STORAGE } from '@core/firebase-auth/constants';
import { WebStorageService } from '@core/firebase-auth/services/utils/web-storage.service';

export const linkAccountGuard: CanActivateFn = (route, state) => {
  const webStorageService = inject(WebStorageService);
  const router = inject(Router);

  webStorageService.useStorage('session');
  const userCredential = webStorageService.getItem<string>(
    KEY_STORAGE.DATA_USER_CREDENTIAL
  );

  if (!userCredential) {
    router.navigateByUrl(router.url);
    return false;
  } else {
    return true;
  }
};
