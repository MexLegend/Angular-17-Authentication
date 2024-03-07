import { Injectable, NgZone, inject, signal } from '@angular/core';

import {
  IGoogleUserInfo,
  IUser,
} from '@core/google-gsi-client/models/user.interface';
import { UserService } from './user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AUTH_REDIRECT } from '@core/google-gsi-client/constants';
import { environment } from '@env/google-gsi-client/environment';
import { Observable, delay, of } from 'rxjs';
import { KEY_STORAGE } from '@core/google-gsi-client/constants';
import { LocalStorageService } from '@core/google-gsi-client/services/utils/local-storage.service';
import { IAuthError } from '@core/google-gsi-client/models/error.interface';
import {
  AuthActionType,
  IAuthState,
} from '@core/google-gsi-client/models/auth.interface';
import { BaseApiService } from '@core/google-gsi-client/models/base-api-service';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends BaseApiService {
  private readonly _authState: IAuthState = {
    $googleAuthAction: signal<AuthActionType>('LOGIN'),
    $googleButtonWrapper: signal<HTMLButtonElement | null>(null),
    $isLoadingAuth: signal<boolean>(false),
    $authError: signal<IAuthError | null>(null),
    $isLoggedIn: signal<boolean>(false),
  } as const;

  readonly $googleAuthAction = this._authState.$googleAuthAction.asReadonly();
  private readonly $googleButtonWrapper =
    this._authState.$googleButtonWrapper.asReadonly();
  readonly $isLoadingAuth = this._authState.$isLoadingAuth.asReadonly();
  readonly $authError = this._authState.$authError.asReadonly();
  readonly $isLoggedIn = this._authState.$isLoggedIn.asReadonly();

  private readonly _router = inject(Router);
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _ngZone = inject(NgZone);

  private readonly _storageService = inject(LocalStorageService);
  private readonly _userService = inject(UserService);

  constructor() {
    super('auth');
    this._configureGoogleAuthentication();
  }

  private _setGoogleAuthAction(authAction: AuthActionType): void {
    this._authState.$googleAuthAction.set(authAction);
  }

  private _setGoogleButtonWrapper(buttonWrapper: HTMLButtonElement): void {
    this._authState.$googleButtonWrapper.set(buttonWrapper);
  }

  setIsLoading(isLoading: boolean): void {
    this._authState.$isLoadingAuth.set(isLoading);
  }

  setAuthError(error: IAuthError | null): void {
    this._authState.$authError.set(error);
  }

  private _setIsLoggedIn(isLoggedIn: boolean): void {
    this._authState.$isLoggedIn.set(isLoggedIn);
  }

  private _configureGoogleAuthentication(): void {
    google.accounts.id.initialize({
      client_id: environment.GOOGLE_CLIENT_ID,
      callback: ({ credential: token }) => {
        this._ngZone.run(() => {
          let authObservable: Observable<IUser>;

          if (this.$googleAuthAction() === 'LOGIN') {
            authObservable = this._googleSignIn(token);
          } else {
            authObservable = this._googleSignUp(token);
          }

          authObservable.subscribe({
            next: (user) => {
              this.authenticateUser(user);
            },
            error: (error) => {
              this.setAuthError(error);
              this.setIsLoading(false);
            },
            complete: () => this.setIsLoading(false),
          });
        });
      },
    });
  }

  setGoogleAuthenticationAction(authAction: AuthActionType) {
    this._setGoogleAuthAction(authAction);
  }

  renderGoogleAuthButton(googleButton: HTMLDivElement) {
    google.accounts.id.renderButton(googleButton, { type: 'icon' });

    const googleSignInButton = googleButton.querySelector(
      'div[role=button]'
    ) as HTMLButtonElement;

    this._setGoogleButtonWrapper(googleSignInButton);
  }

  loadUserFromStorage(): IUser | null {
    const userFromStorage = this._storageService.getItem<IUser>(
      KEY_STORAGE.DATA_USER
    );

    if (userFromStorage) {
      this._userService.setUserData(userFromStorage);
      this._setIsLoggedIn(true);
    }

    return userFromStorage;
  }

  authenticateUser(userData: IUser): void {
    const redirectUrl =
      this._activatedRoute.snapshot.queryParams[AUTH_REDIRECT];

    this._userService.setUserData(userData);
    this._storageService.setItem(KEY_STORAGE.DATA_USER, userData);
    this._setIsLoggedIn(true);
    this._router.navigateByUrl(redirectUrl || '/');
  }

  authenticateByGoogle(): void {
    this.setAuthError(null);
    this.$googleButtonWrapper()?.click();
  }

  private _googleSignIn(token: string): Observable<IUser> {
    this.setIsLoading(true);
    console.log('Google Login: ', token);

    const userInfo: IGoogleUserInfo = JSON.parse(atob(token.split('.')[1]));

    const user: IUser = {
      id: '1972',
      googleUserId: userInfo.sub,
      name: userInfo.name,
      email: userInfo.email,
      image: userInfo.picture,
    };

    return of(user).pipe(delay(1000));

    return this.post('google/signin', { token });
  }

  private _googleSignUp(token: string): Observable<IUser> {
    this.setIsLoading(true);
    console.log('Google Register: ', token);

    const userInfo: IGoogleUserInfo = JSON.parse(atob(token.split('.')[1]));

    const user: IUser = {
      id: '1972',
      googleUserId: userInfo.sub,
      name: userInfo.name,
      email: userInfo.email,
      image: userInfo.picture,
    };

    return of(user).pipe(delay(1000));

    return this.post('google/signup');
  }

  signOut(): Observable<void> {
    return new Observable((observer) => {
      // Logout from Google
      google.accounts.id.disableAutoSelect();

      this._setIsLoggedIn(false);
      this._router.navigateByUrl('/auth').then(() => {
        this._storageService.removeItem(KEY_STORAGE.DATA_USER);
        this._userService.setUserData(null);

        observer.next();
        observer.complete();
      });
    });
  }
}
