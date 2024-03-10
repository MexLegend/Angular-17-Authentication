import {
  Component,
  Signal,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';
import { UserService } from '@core/firebase-auth/services/common/user.service';
import { IUser } from '@core/firebase-auth/models/user.interface';
import { AsyncPipe, JsonPipe, NgClass, NgOptimizedImage } from '@angular/common';
import { LoadingIconComponent } from '@shared/firebase-auth/icons/loading-icon.component';
import { GoogleIconComponent } from '@shared/firebase-auth/icons/google-icon.component';
import { FacebookBlueIconComponent } from '@shared/firebase-auth/icons/facebook-blue-icon.component';
import { TwitterBlueIconComponent } from '@shared/firebase-auth/icons/twitter-blue-icon.component';
import { GithubIconComponent } from '@shared/firebase-auth/icons/github-icon.component';
import { AuthService } from '@core/firebase-auth/services/common/auth.service';
import { PROVIDER_FIREBASE_AUTH } from '@core/firebase-auth/constants';
import { AUTH_PROVIDERS } from '@core/firebase-auth/constants/auth-providers.constant';
import { AuthProviderLinkPipe } from '@core/firebase-auth/pipes';
import { IHttpError } from '@core/firebase-auth/models';
import { HttpErrorComponent } from '@shared/firebase-auth/components/http-error/auth-form-error.component';
import { UserAvatarComponent } from '@shared/firebase-auth/components/user-avatar/user-avatar.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    JsonPipe,
    AsyncPipe,
    AuthProviderLinkPipe,
    NgClass,
    HttpErrorComponent,
    UserAvatarComponent,
    LoadingIconComponent,
    GoogleIconComponent,
    FacebookBlueIconComponent,
    TwitterBlueIconComponent,
    GithubIconComponent,
    NgOptimizedImage
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent {
  private readonly _authService = inject(AuthService);
  private readonly _userService = inject(UserService);

  readonly authProviders = AUTH_PROVIDERS;
  readonly $userData: Signal<IUser | null> = this._userService.$user;
  readonly $isLoading: Signal<boolean> = this._authService.$isLoadingAuth;
  readonly $providerError: WritableSignal<IHttpError | null> = signal(null);

  linkOrUnlinkAccount(authProvider: PROVIDER_FIREBASE_AUTH) {
    this.$providerError.set(null);
    this._authService.linkOrUnlinkAccount(authProvider).subscribe({
      next: (user) => {
        this._userService.setUserData({
          ...this.$userData()!,
          providerData: user.providerData,
        });
      },
      error: (error: IHttpError) => {
        error.httpError === 'UNAUTHORIZED'
          ? this._authService.signOut()
          : this.$providerError.set(error);
      },
    });
  }
}
