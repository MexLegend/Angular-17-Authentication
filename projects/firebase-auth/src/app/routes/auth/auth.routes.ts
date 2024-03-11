import { Routes } from '@angular/router';
import { linkAccountGuard, verifyEmailGuard } from '@core/firebase-auth/guards';

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login-page/login-page.component').then(
        (c) => c.LoginPageComponent
      ),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register-page/register-page.component').then(
        (c) => c.RegisterPageComponent
      ),
  },
  {
    path: 'link-account',
    canActivate: [linkAccountGuard],
    loadComponent: () =>
      import('./pages/link-account-page/link-account-page.component').then(
        (c) => c.LinkAccountPageComponent
      ),
  },
  {
    path: 'verify-email',
    canActivate: [verifyEmailGuard],
    loadComponent: () =>
      import('./pages/verify-email-page/verify-email-page.component').then(
        (c) => c.VerifyEmailPageComponent
      ),
  },
  {
    path: 'reset-password',
    loadComponent: () =>
      import('./pages/reset-password-page/reset-password-page.component').then(
        (c) => c.ResetPasswordPageComponent
      ),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];
