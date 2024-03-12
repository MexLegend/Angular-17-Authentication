import { Routes } from '@angular/router';
export const PRODUCT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/products-page/products-page.component').then(
        (c) => c.ProductsPageComponent
      ),
  },
];
