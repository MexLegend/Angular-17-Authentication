import { ApplicationConfig } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withViewTransitions } from '@angular/router';
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
import { provideToastr } from 'ngx-toastr';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withViewTransitions()),
    provideHttpClient(withFetch(), withInterceptors([errorHandlerInterceptor])),
    provideAnimations(),
    provideToastr(),
    userProviders,
    firebaseProviders,
  ],
};
