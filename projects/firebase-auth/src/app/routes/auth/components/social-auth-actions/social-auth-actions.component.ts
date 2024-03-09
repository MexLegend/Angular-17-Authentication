import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Signal,
  inject,
} from '@angular/core';
import { AuthService } from '@core/firebase-auth/services/common/auth.service';
import { IAuthError } from '@core/firebase-auth/models';
import { PROVIDER_FIREBASE_AUTH } from '@core/firebase-auth/constants';
import { GoogleIconComponent } from '@shared/firebase-auth/icons/google-icon.component';
import { FacebookBlueIconComponent } from '@shared/firebase-auth/icons/facebook-blue-icon.component';

@Component({
  selector: 'app-social-auth-actions',
  standalone: true,
  imports: [GoogleIconComponent, FacebookBlueIconComponent, NgClass],
  providers: [],
  templateUrl: './social-auth-actions.component.html',
  styleUrl: './social-auth-actions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SocialAuthActionsComponent {
  private readonly _authService = inject(AuthService);
  readonly $isLoading: Signal<boolean> = this._authService.$isLoadingAuth;

  authenticateWithProvider(providerType: PROVIDER_FIREBASE_AUTH) {
    this._authService.authenticateWithProvider(providerType).subscribe({
      next: () => {
        this._authService.authenticateUser();
      },
      error: (error: IAuthError) => {
        this._authService.setAuthError(error);
      },
    });
  }
}
