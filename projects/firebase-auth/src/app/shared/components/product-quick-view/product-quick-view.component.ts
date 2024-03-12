import { CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent } from '@angular/material/dialog';
import { IProduct } from '@core/firebase-auth/models';

@Component({
  selector: 'app-product-quick-view',
  standalone: true,
  imports: [MatDialogContent, MatDialogActions, MatDialogClose, NgOptimizedImage, CurrencyPipe],
  templateUrl: './product-quick-view.component.html',
  styleUrl: './product-quick-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductQuickViewComponent {

  readonly product: IProduct = inject(MAT_DIALOG_DATA);

}
