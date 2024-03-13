import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, finalize, switchMap } from 'rxjs';
import { FirebaseStoreService } from '@core/firebase-auth/services/utils/firebase/firebase-store.service';
import {
  FAKE_API_URL,
  NAME_FIREBASE_COLLECTION,
} from '@core/firebase-auth/constants';
import {
  IHttpError,
  IProduct,
  IProductState,
} from '@core/firebase-auth/models';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly _http = inject(HttpClient);
  private readonly _firestoreService = inject(FirebaseStoreService);

  // State
  private readonly _productState: IProductState = {
    $products: signal<IProduct[]>([]),
    $isLoadingProducts: signal<boolean>(false),
    $productsError: signal<IHttpError | null>(null),
  } as const;

  // Selectors
  readonly $products = this._productState.$products.asReadonly();
  readonly $isLoadingProduct =
    this._productState.$isLoadingProducts.asReadonly();
  readonly $productError = this._productState.$productsError.asReadonly();

  // Reducers
  constructor() {
    this.getProducts();
  }

  setIsLoading(isLoading: boolean): void {
    this._productState.$isLoadingProducts.set(isLoading);
  }

  setProductError(error: IHttpError): void {
    this._productState.$productsError.set(error);
  }

  private _setProducts(products: IProduct[]): void {
    this._productState.$products.set(products);
  }

  createdProduct(): Observable<IProduct> {
    return this.getRandomFakeStoreApiProduct().pipe(
      switchMap(({ id, ...productData }) => {
        return this._firestoreService.addDocument<IProduct>(
          NAME_FIREBASE_COLLECTION.PRODUCTS,
          productData
        );
      })
    );
  }

  getProducts(): void {
    this.setIsLoading(true);
    this._firestoreService
      .getAllDocuments<IProduct[]>(NAME_FIREBASE_COLLECTION.PRODUCTS)
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (products) => {
          console.log(products);

          this.setIsLoading(false);
          this._setProducts(products);
        },
        error: (error) => {
          this.setIsLoading(false);
          this.setProductError(error);
        },
      });
  }

  getProductById(productId: string): Observable<IProduct> {
    // this.setIsLoading(true);
    return this._firestoreService.getOneDocumentById<IProduct>(
      NAME_FIREBASE_COLLECTION.PRODUCTS,
      productId
    );
    // .pipe(finalize(() => this.setIsLoading(false)));
  }

  updateProductById(productId: string): Observable<IProduct> {
    return this.getRandomFakeStoreApiProduct().pipe(
      switchMap(({ id, ...productData }) => {
        return this._firestoreService.updateDocumentById<IProduct>(
          NAME_FIREBASE_COLLECTION.PRODUCTS,
          productId,
          productData
        );
      })
    );
  }

  deleteProductById(productId: string): Observable<void> {
    return this._firestoreService.deleteDocumentById(
      NAME_FIREBASE_COLLECTION.PRODUCTS,
      productId
    );
  }

  getRandomFakeStoreApiProduct(): Observable<IProduct> {
    return this._http.get<IProduct>(
      `${FAKE_API_URL}/${this.getRamdomNumber()}`
    );
  }

  getRamdomNumber(maxNumber: number = 20) {
    return Math.floor(Math.random() * maxNumber);
  }
}
