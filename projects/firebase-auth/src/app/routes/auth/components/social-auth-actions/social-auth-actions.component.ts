import { NgClass } from '@angular/common';
import { Router } from '@angular/router';
import {
  ChangeDetectionStrategy,
  Component,
  Signal,
  inject,
} from '@angular/core';
import { AuthService } from '@core/firebase-auth/services/common/auth.service';
import { IHttpError } from '@core/firebase-auth/models';
import {
  KEY_STORAGE,
  PROVIDER_FIREBASE_AUTH,
} from '@core/firebase-auth/constants';
import { GoogleIconComponent } from '@shared/firebase-auth/icons/google-icon.component';
import { FacebookBlueIconComponent } from '@shared/firebase-auth/icons/facebook-blue-icon.component';
import { GithubIconComponent } from '@shared/firebase-auth/icons/github-icon.component';
import { TwitterBlueIconComponent } from '@shared/firebase-auth/icons/twitter-blue-icon.component';
import { WebStorageService } from '@core/firebase-auth/services/utils/web-storage.service';

@Component({
  selector: 'app-social-auth-actions',
  standalone: true,
  imports: [
    GoogleIconComponent,
    FacebookBlueIconComponent,
    GithubIconComponent,
    TwitterBlueIconComponent,
    NgClass,
  ],
  providers: [],
  templateUrl: './social-auth-actions.component.html',
  styleUrl: './social-auth-actions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SocialAuthActionsComponent {
  private readonly _authService = inject(AuthService);
  private readonly _webStorageService = inject(WebStorageService);
  private readonly _router = inject(Router);

  readonly $isLoading: Signal<boolean> = this._authService.$isLoadingAuth;

  authenticateWithProvider(providerType: PROVIDER_FIREBASE_AUTH) {
    this._authService.authenticateWithProvider(providerType).subscribe({
      next: () => {
        this._authService.authenticateUser();
      },
      error: (error: IHttpError) => {
        if (error.customData?.shouldRequestLinkAccount) {
          this._webStorageService.useStorage('session');
          this._webStorageService.setItem(KEY_STORAGE.DATA_USER_CREDENTIAL, {
            email: error.customData?.email,
            pendingCredential: error.customData?.pendingCredential,
          });
          console.log("Here");
          this._router.navigate(['/auth/link-account']);
          
          return;
        }

        this._authService.setAuthError(error);
      },
    });
  }
}
