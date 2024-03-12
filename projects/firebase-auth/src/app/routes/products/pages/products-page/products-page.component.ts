import { Component, OnInit, Signal, inject } from '@angular/core';
import { IProduct } from '@core/firebase-auth/models';
import { ProductService } from '@core/firebase-auth/services/common/product.service';

@Component({
  selector: 'app-products-page',
  standalone: true,
  imports: [],
  templateUrl: './products-page.component.html',
  styleUrl: './products-page.component.scss',
})
export class ProductsPageComponent implements OnInit {
  private readonly _productService = inject(ProductService);

  readonly $products: Signal<IProduct[]> = this._productService.$products;

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts() {
    this._productService.getProductsFaker().subscribe({
      next: (products) => {
        console.log({ products });

        return this._productService.setProducts(products);
      },
      error: (error) => this._productService.setProductError(error),
    });
  }

  createProduct() {
    this._productService.getProductByFaker().subscribe({
      next: (product) => {
        console.log({ product });

        // return this._productService.setProducts(products);
      },
    });
  }
}
