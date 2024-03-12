import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ProductService } from '@core/firebase-auth/services/common/product.service';
import { IProduct } from '@core/firebase-auth/models';

export const productIdResolver: ResolveFn<IProduct> = (route, state) => {
  const productService = inject(ProductService);

  return productService.getProductById(route.params['id']);
};
