import {
  Injectable,
  NgZone,
  Signal,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';

import { IUser } from '@core/google-auth2-gapi/models/user.interface';
import { UserService } from './user.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AUTH_REDIRECT,
  KEY_GAPI_LOAD,
} from '@core/google-auth2-gapi/constants';
import { environment } from '@env/google-auth2-gapi/environment';
import { Observable, Subject, Subscriber, delay, of } from 'rxjs';
import { KEY_STORAGE } from '@core/google-auth2-gapi/constants/storage-keys.enum';
import { LocalStorageService } from '@core/google-auth2-gapi/services/utils/local-storage.service';
import { IAuthError } from '@core/google-auth2-gapi/models/error.interface';
import { AuthActionType } from '@core/google-auth2-gapi/models/auth.interface';
import { BaseApiService } from '@core/google-auth2-gapi/models/base-api-service';

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
  private readonly _googleAuthSubject: Subject<IUser> = new Subject();
  private readonly _gapiAuth2: WritableSignal<gapi.auth2.GoogleAuth | null> =
    signal(null);

  constructor() {
    super('auth');
  }

  initGoogleAuthConfig(): void {
    gapi.load(KEY_GAPI_LOAD.AUTH2, () => {
      console.log("Hey");
      
      const gapiAuth2 = gapi.auth2.init({
        client_id: environment.GOOGLE_CLIENT_ID,
      });

      this._gapiAuth2.set(gapiAuth2);
    });
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

  getIsLoading(): Signal<boolean> {
    return this._$isLoading.asReadonly();
  }

  stopIsLoading(): void {
    return this._$isLoading.set(false);
  }

  getAuthError(): Signal<IAuthError | null> {
    return this._$authError.asReadonly();
  }

  setAuthError(authError: IAuthError): void {
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

  authenticateByGoogle(authAction: AuthActionType): Observable<IUser> {
    return new Observable((observer) => {
      this._$isLoading.set(true);

      this._gapiAuth2()!
        .signIn({
          //
        })
        .then((googleUser) => {
          let authObservable: Observable<IUser> =
            authAction === 'LOGIN'
              ? this._googleSignIn(googleUser)
              : this._googleSignUp(googleUser);

          authObservable.subscribe({
            next: (user) => {
              this._googleAuthSubject.next(user);
            },
            error: (error) => observer.error(error),
            complete: () => this._$isLoading.set(false),
          });
        })
        .catch((error: Error) => observer.error(error));
    });
  }

  private _googleSignIn(googleUser: gapi.auth2.GoogleUser): Observable<IUser> {
    const userInfo = googleUser.getBasicProfile();
    const user: IUser = {
      id: '1972',
      googleUserId: userInfo.getId(),
      name: userInfo.getName(),
      email: userInfo.getEmail(),
      image: userInfo.getImageUrl(),
    };
    console.log('Google SignIn');

    return of(user).pipe(delay(1000));

    return this.post('google/signin', {
      token: googleUser.getAuthResponse().access_token,
    });
  }

  private _googleSignUp(googleUser: gapi.auth2.GoogleUser): Observable<IUser> {
    const userInfo = googleUser.getBasicProfile();
    const user: IUser = {
      id: '1972',
      googleUserId: userInfo.getId(),
      name: userInfo.getName(),
      email: userInfo.getEmail(),
      image: userInfo.getImageUrl(),
    };
    console.log('Google SignUp');

    return of(user).pipe(delay(1000));

    return this.post('google/signup', {
      token: googleUser.getAuthResponse().access_token,
    });
  }

  signOut(): Observable<void> {
    return new Observable((observer) => {
      if (this._gapiAuth2()?.isSignedIn.get()) {
        this._gapiAuth2()
          ?.signOut()
          .then(() => this.invalidateUser(observer))
          .catch((error: Error) => observer.error(error));
      } else {
        this.invalidateUser(observer);
      }
    });
  }

  invalidateUser(observer: Subscriber<void>) {
    this._$isLoggedIn.set(false);
    this._router.navigateByUrl('/auth').then(() => {
      this._storageService.removeItem(KEY_STORAGE.DATA_USER);
      this._userService.setUserData(null);

      observer.next();
      observer.complete();
    });
  }
}
