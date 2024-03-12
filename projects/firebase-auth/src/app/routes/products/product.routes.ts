import { Routes } from '@angular/router';
import { productIdResolver } from '@core/firebase-auth/resolvers';
export const PRODUCT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/products-page/products-page.component').then(
        (c) => c.ProductsPageComponent
      ),
  },
  {
    path: ':id',
    resolve: {
      product: productIdResolver,
    },
    loadComponent: () =>
      import('./pages/product-details-page/product-details-page.component').then(
        (c) => c.ProductDetailsPageComponent
      ),
  },
];
