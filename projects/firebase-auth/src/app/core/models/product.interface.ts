import { WritableSignal } from '@angular/core';
import { IHttpError } from './http-error.interface';

export interface IProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

export interface IProductState {
  $products: WritableSignal<IProduct[]>;
  $isLoadingProduct: WritableSignal<boolean>;
  $productError: WritableSignal<IHttpError | null>;
}
