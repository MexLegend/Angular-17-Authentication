import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { provideOAuthClient } from 'angular-oauth2-oidc';
import { AuthService } from './core/services/common/auth.service';
import { errorHandlerInterceptor } from './core/interceptors/error-handler.interceptor';
import { gmailInterceptor } from './core/interceptors/gmail.intercetor';

const loadUserFromStorage = (authService: AuthService) => {
  return () => authService.loadUserFromStorage();
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withFetch(),
      withInterceptors([errorHandlerInterceptor, gmailInterceptor])
    ),
    provideOAuthClient(),
    {
      provide: APP_INITIALIZER,
      useFactory: loadUserFromStorage,
      deps: [AuthService],
      multi: true,
    },
  ],
};
