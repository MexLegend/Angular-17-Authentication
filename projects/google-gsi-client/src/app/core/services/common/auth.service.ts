import {
  Injectable,
  NgZone,
  Signal,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';

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
import { AuthActionType } from '@core/google-gsi-client/models/auth.interface';
import { BaseApiService } from '@core/google-gsi-client/models/base-api-service';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends BaseApiService {
  private readonly _router = inject(Router);
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _ngZone = inject(NgZone);

  private readonly _storageService = inject(LocalStorageService);
  private readonly _userService = inject(UserService);

  private readonly _$isLoggedIn: WritableSignal<boolean> = signal(false);
  private readonly _$isLoading: WritableSignal<boolean> = signal(false);
  private readonly _$authError: WritableSignal<IAuthError | null> =
    signal(null);
  private readonly _$googleAuthAction: WritableSignal<AuthActionType> =
    signal('LOGIN');
  private readonly _$googleButtonWrapper: WritableSignal<HTMLButtonElement | null> =
    signal(null);

  constructor() {
    super('auth');
    this._configureGoogleAuthentication();
  }

  private _configureGoogleAuthentication(): void {
    google.accounts.id.initialize({
      client_id: environment.GOOGLE_CLIENT_ID,
      callback: ({ credential: token }) => {
        this._ngZone.run(() => {
          let authObservable: Observable<IUser>;

          if (this._$googleAuthAction() === 'LOGIN') {
            authObservable = this._googleSignIn(token);
          } else {
            authObservable = this._googleSignUp(token);
          }

          authObservable.subscribe({
            next: (user) => {
              this.authenticateUser(user);
            },
            error: (error) => {
              this._$authError.set(error);
              this._$isLoading.set(false);
            },
            complete: () => this._$isLoading.set(false),
          });
        });
      },
    });
  }

  setGoogleAuthenticationAction(authAction: AuthActionType) {
    this._$googleAuthAction.set(authAction);
  }

  renderGoogleAuthButton(googleButton: HTMLDivElement) {
    google.accounts.id.renderButton(googleButton, { type: 'icon' });

    const googleSignInButton = googleButton.querySelector(
      'div[role=button]'
    ) as HTMLButtonElement;

    this._$googleButtonWrapper.set(googleSignInButton);
  }

  loadUserFromStorage(): IUser | null {
    const userFromStorage = this._storageService.getItem<IUser>(
      KEY_STORAGE.DATA_USER
    );

    if (userFromStorage) {
      this._userService.setUserData(userFromStorage);
      this._$isLoggedIn.set(true);
    }

    return userFromStorage;
  }

  isLoggedIn(): boolean {
    return this._$isLoggedIn();
  }

  isLoading(): Signal<boolean> {
    return this._$isLoading.asReadonly();
  }

  stopIsLoading(): void {
    return this._$isLoading.set(false);
  }

  getAuthError(): Signal<IAuthError | null> {
    return this._$authError.asReadonly();
  }

  setAuthError(authError: IAuthError | null): void {
    return this._$authError.set(authError);
  }

  authenticateUser(userData: IUser): void {
    const redirectUrl =
      this._activatedRoute.snapshot.queryParams[AUTH_REDIRECT];

    this._userService.setUserData(userData);
    this._storageService.setItem(KEY_STORAGE.DATA_USER, userData);
    this._$isLoggedIn.set(true);
    this._router.navigateByUrl(redirectUrl || '/');
  }

  authenticateByGoogle(): void {
    this._$authError.set(null);
    this._$googleButtonWrapper()?.click();
  }

  private _googleSignIn(token: string): Observable<IUser> {
    this._$isLoading.set(true);
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
    this._$isLoading.set(true);
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

      this._$isLoggedIn.set(false);
      this._router.navigateByUrl('/auth').then(() => {
        this._storageService.removeItem(KEY_STORAGE.DATA_USER);
        this._userService.setUserData(null);

        observer.next();
        observer.complete();
      });
    });
  }
}
