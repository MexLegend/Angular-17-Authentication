import { CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FacebookAuthProvider, signInWithPopup } from '@angular/fire/auth';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
} from '@angular/material/dialog';
import { IProduct, IUser } from '@core/firebase-auth/models';
import { UserService } from '@core/firebase-auth/services/common/user.service';
import { FirebaseAuthService } from '@core/firebase-auth/services/utils/firebase/firebase-auth.service';

@Component({
  selector: 'app-product-quick-view',
  standalone: true,
  imports: [
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    NgOptimizedImage,
    CurrencyPipe,
  ],
  templateUrl: './product-quick-view.component.html',
  styleUrl: './product-quick-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductQuickViewComponent {
  readonly product: IProduct = inject(MAT_DIALOG_DATA);
  private readonly _userService = inject(UserService);
  private readonly _firebaseAuthService = inject(FirebaseAuthService);

  private readonly _auth = this._firebaseAuthService._auth;

  async publish() {
    try {
      const result = await signInWithPopup(
        this._auth,
        new FacebookAuthProvider()
      );
      const credential = FacebookAuthProvider.credentialFromResult(result);
      let accessToken = credential!.accessToken;
      // const accessToken = await this._auth.currentUser?.getIdToken();

      // Publicar en Facebook utilizando el token de acceso
      const message = `¡Nuevo producto disponible! ${this.product.title}: ${this.product.description}`;
      const response = await fetch(`https://graph.facebook.com/me/feed`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          access_token: accessToken,
        }),
      });

      const data = await response.json();

      console.log('Producto publicado en Facebook:', data);
    } catch (error) {
      console.error('Error al publicar en Facebook:', error);
      throw error;
    }
  }
}
