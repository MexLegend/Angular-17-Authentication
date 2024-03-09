import { Routes } from '@angular/router';
import { loggedGuard } from './core/guards';
import { unloggedGuard } from './core/guards';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: 'home',
    canActivate: [loggedGuard],
    loadComponent: () =>
      import('./core/layout/main-layout/main-layout.component').then(
        (c) => c.MainLayoutComponent
      ),
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./routes/home/home.routes').then((r) => r.HOME_ROUTES),
      },
    ],
  },
  {
    path: 'auth',
    canActivate: [unloggedGuard],
    loadComponent: () =>
      import('./core/layout/auth-layout/auth-layout.component').then(
        (c) => c.AuthLayoutComponent
      ),
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./routes/auth/auth.routes').then((r) => r.AUTH_ROUTES),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
