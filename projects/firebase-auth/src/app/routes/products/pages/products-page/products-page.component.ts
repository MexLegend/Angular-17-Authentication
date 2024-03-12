import { CurrencyPipe, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Signal,
  inject,
} from '@angular/core';
import { IProduct } from '@core/firebase-auth/models';
import { ProductService } from '@core/firebase-auth/services/common/product.service';
import { ButtonComponent } from '@shared/firebase-auth/components/button/button.component';
import { EditIconComponent } from '@shared/firebase-auth/icons/edit-icon.component';
import { LoadingIconComponent } from '@shared/firebase-auth/icons/loading-icon.component';
import { TrashIconComponent } from '@shared/firebase-auth/icons/trash-icon.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-products-page',
  standalone: true,
  imports: [
    ButtonComponent,
    LoadingIconComponent,
    TrashIconComponent,
    EditIconComponent,
    CurrencyPipe,
    NgOptimizedImage,
  ],
  providers: [],
  templateUrl: './products-page.component.html',
  styleUrl: './products-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsPageComponent {
  private readonly _productService = inject(ProductService);
  private readonly _toastrService = inject(ToastrService);

  readonly $products: Signal<IProduct[]> = this._productService.$products;
  readonly $isLoadingProducts: Signal<boolean> =
    this._productService.$isLoadingProduct;

  createProduct() {
    this._productService.createdProduct().subscribe({
      error: () => {
        this._toastrService.error(
          'Unable to complete product creation. Please try again.',
          'Error Creating Product!'
        );
      },
    });
  }

  updateProductById(productId: string) {
    this._productService.deleteProductById(productId).subscribe({
      error: () => {
        this._toastrService.error(
          'Unable to complete product update. Please try again.',
          'Error Updating Product!'
        );
      },
    });
  }

  deleteProductById(productId: number) {
    this._productService.deleteProductById(productId.toString()).subscribe({
      error: () => {
        this._toastrService.error(
          'Unable to complete product deletion. Please try again.',
          'Error Deleting Product!'
        );
      },
    });
  }
}
