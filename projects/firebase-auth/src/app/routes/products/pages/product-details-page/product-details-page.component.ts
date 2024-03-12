import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IProduct } from '@core/firebase-auth/models';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [],
  templateUrl: './product-details-page.component.html',
  styleUrl: './product-details-page.component.scss'
})
export class ProductDetailsPageComponent {
  private readonly _route = inject(ActivatedRoute);

  product!: IProduct;

  ngOnInit(): void {
    this.product = this._route.snapshot.data['product'] as IProduct;
    console.log(this.product);
    
  }
}
