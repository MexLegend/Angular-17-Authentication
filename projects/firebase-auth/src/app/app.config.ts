import { ApplicationConfig } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { errorHandlerInterceptor } from '@core/firebase-auth/interceptors';
import { routes } from './app.routes';
import {
  userProviders,
  firebaseProviders,
} from '@core/firebase-auth/providers';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch(), withInterceptors([errorHandlerInterceptor])),
    provideAnimations(),
    userProviders,
    firebaseProviders,
  ],
};
