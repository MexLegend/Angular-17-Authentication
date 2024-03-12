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
import { MatMenuModule } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { ProductQuickViewComponent } from '@shared/firebase-auth/components/product-quick-view/product-quick-view.component';

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
    MatMenuModule,
    MatIcon,
  ],
  providers: [],
  templateUrl: './products-page.component.html',
  styleUrl: './products-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsPageComponent {
  private readonly _productService = inject(ProductService);
  private readonly _toastrService = inject(ToastrService);
  private readonly _matDialog = inject(MatDialog);

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
    this._productService.updateProductById(productId).subscribe({
      error: () => {
        this._toastrService.error(
          'Unable to complete product update. Please try again.',
          'Error Updating Product!'
        );
      },
    });
  }

  deleteProductById(productId: string) {
    this._productService.deleteProductById(productId.toString()).subscribe({
      error: () => {
        this._toastrService.error(
          'Unable to complete product deletion. Please try again.',
          'Error Deleting Product!'
        );
      },
    });
  }

  productQuickView(product: IProduct) {
    const dialogRef = this._matDialog.open(ProductQuickViewComponent, {
      data: product,
      maxWidth: 800,
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
