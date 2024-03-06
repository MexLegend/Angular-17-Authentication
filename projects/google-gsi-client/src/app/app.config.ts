import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideOAuthClient } from 'angular-oauth2-oidc';
import { AuthService } from './core/services/common/auth.service';

const loadUserFromStorage = (authService: AuthService) => {
  return () => authService.loadUserFromStorage();
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch()),
    provideOAuthClient(),
    {
      provide: APP_INITIALIZER,
      useFactory: loadUserFromStorage,
      deps: [AuthService],
      multi: true,
    },
  ],
};
