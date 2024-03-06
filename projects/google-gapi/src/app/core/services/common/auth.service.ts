import {
  Injectable,
  Signal,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';

import { IUser } from '@core/google-gapi/models/user.interface';
import { UserService } from './user.service';
import { Router } from '@angular/router';
import { LOAD_GOOGLE_GAPI_KEY } from '@core/google-gapi/constants';
import { environment } from '@env/google-gapi/environment';
import { Observable } from 'rxjs';
import { KEY_STORAGE } from '@core/advanced-auth/models/storage.enum';
import { LocalStorageService } from '@core/google-gapi/services/utils/local-storage.service';
import { IAuthError } from '@core/google-gapi/models/error.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _router = inject(Router);

  private readonly _storageService = inject(LocalStorageService);
  private readonly _userService = inject(UserService);

  private readonly _gapiAuth2: WritableSignal<gapi.auth2.GoogleAuth | null> =
    signal(null);
  private readonly _$isLoggedIn: WritableSignal<boolean> = signal(false);
  private readonly _$isLoading: WritableSignal<boolean> = signal(false);
  private readonly _$authError: WritableSignal<IAuthError | null> =
    signal(null);

  initGoogleAuthConfig() {
    gapi.load(LOAD_GOOGLE_GAPI_KEY, () => {
      const gapiAuth2 = gapi.auth2.init({
        client_id: environment.googleClientId,
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

  authenticateByGoogle(): Observable<gapi.auth2.GoogleUser> {
    return new Observable((observer) => {
      this._gapiAuth2()!
        .signIn({
          //
        })
        .then((data) => {
          observer.next(data);
          observer.complete();
        })
        .catch((error) => observer.error(error));
    });
  }

  signOut(): Observable<void> {
    return new Observable((observer) => {
      // Logout from Google
      if (this._gapiAuth2()!.isSignedIn) {
        this._gapiAuth2()!
          .signOut()
          .then(() => {})
          .catch((error: Error) => observer.error(error));
      }

      this._$isLoggedIn.set(false);
      this._router.navigateByUrl('/auth').then(() => {
        this._storageService.removeItem(KEY_STORAGE.DATA_USER);
        this._userService.setUserData(null);
      });

      observer.next();
      observer.complete();
    });
  }
}
