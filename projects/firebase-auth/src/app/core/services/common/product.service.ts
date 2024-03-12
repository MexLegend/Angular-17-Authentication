import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { FAKE_API_URL } from '@core/firebase-auth/constants';
import {
  IHttpError,
  IProduct,
  IProductState,
} from '@core/firebase-auth/models';
import { Observable, finalize, map, of } from 'rxjs';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';

const PATH = 'products';
@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly _http = inject(HttpClient);

  private _firestore = inject(Firestore);
  private _collection = collection(this._firestore, PATH);

  private readonly _productState: IProductState = {
    $products: signal<IProduct[]>([]),
    $isLoadingProduct: signal<boolean>(false),
    $productError: signal<IHttpError | null>(null),
  } as const;

  readonly $products = this._productState.$products.asReadonly();
  readonly $isLoadingProduct =
    this._productState.$isLoadingProduct.asReadonly();
  readonly $productError = this._productState.$productError.asReadonly();

  setIsLoading(isLoading: boolean): void {
    this._productState.$isLoadingProduct.set(isLoading);
  }

  setProductError(error: IHttpError): void {
    this._productState.$productError.set(error);
  }

  setProducts(products: IProduct[]): void {
    this._productState.$products.set(products);
  }

  getRamdom(maxNumber: number = 20) {
    return Math.floor(Math.random() * maxNumber);
  }

  getProductsFaker(): Observable<IProduct[]> {
    this.setIsLoading(true);
    // return of<IProduct[]>([
    //   {
    //     id: 1,
    //     title: 'test_1',
    //     price: 542,
    //     description: '',
    //     category: '',
    //     image: '',
    //     rating: {
    //       rate: 0,
    //       count: 4,
    //     },
    //   },
    //   {
    //     id: 2,
    //     title: 'zapatos',
    //     price: 1248,
    //     description: '',
    //     category: '',
    //     image: '',
    //     rating: {
    //       rate: 0,
    //       count: 4,
    //     },
    //   },
    //   {
    //     id: 3,
    //     title: 'pantalon',
    //     price: 320,
    //     description: '',
    //     category: '',
    //     image: '',
    //     rating: {
    //       rate: 0,
    //       count: 4,
    //     },
    //   },
    // ]).pipe(finalize(() => this.setIsLoading(false)));
    return this._http.get(FAKE_API_URL + '/' + this.getRamdom()).pipe(
      map((resp) => {
        console.log(resp);
        return [resp] as IProduct[];
      })
    );
    // .pipe(finalize(() => this.setIsLoading(false)));
  }

  getProductByFaker(): Observable<IProduct> {
    this.setIsLoading(true);
    return this._http.get<IProduct>(FAKE_API_URL + '/' + this.getRamdom());
    // .pipe(finalize(() => this.setIsLoading(false)));
  }

  getProducts() {
    return collectionData(this._collection) as Observable<IProduct[]>;
  }

  create(tutorial: IProduct): any {
    return this.productsRef.add({ ...tutorial });
  }

  update(id: string, data: any): Promise<void> {
    return this.productsRef.doc(id).update(data);
  }

  delete(id: string): Promise<void> {
    return this.productsRef.doc(id).delete();
  }
}
