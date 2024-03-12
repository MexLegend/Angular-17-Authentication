import { ApplicationConfig } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  provideRouter,
  withComponentInputBinding,
  withViewTransitions,
} from '@angular/router';
import { errorHandlerInterceptor } from '@core/firebase-auth/interceptors';
import { routes } from './app.routes';
import { firebaseProviders } from '@core/firebase-auth/providers';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding(), withViewTransitions()),
    provideHttpClient(withFetch(), withInterceptors([errorHandlerInterceptor])),
    provideAnimations(),
    provideToastr(),
    firebaseProviders,
  ],
};
