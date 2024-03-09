import { inject, Injectable } from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import {
  Auth,
  GoogleAuthProvider,
  UserCredential,
  authState,
  createUserWithEmailAndPassword,
  getAdditionalUserInfo,
  signInWithEmailAndPassword,
  signInWithPopup,
} from '@angular/fire/auth';
import { Observable, catchError, from, throwError } from 'rxjs';
import {
  FIREBASE_ERROR_MESSAGES,
  PROVIDER_FIREBASE_AUTH,
  PROVIDER_FIREBASE_AUTH_INSTANCES,
} from '@core/firebase-auth/constants';
import {
  IAuthWithProviderResponse,
  ILoginData,
  IRegisterData,
} from '@core/firebase-auth/models';

@Injectable({
  providedIn: 'root',
})
export class FirebaseAuthService {
  private _auth: Auth = inject(Auth);

  readonly _$authState = authState(this._auth);

  public signUpWithEmailAndPassword(
    credential: IRegisterData
  ): Observable<UserCredential> {
    return from(
      createUserWithEmailAndPassword(
        this._auth,
        credential.email,
        credential.password
      )
    ).pipe(catchError((error) => this._catchFirebaseError(error)));
  }

  public signInWithEmailAndPassword(
    credential: ILoginData
  ): Observable<UserCredential> {
    return from(
      signInWithEmailAndPassword(
        this._auth,
        credential.email,
        credential.password
      )
    ).pipe(catchError((error) => this._catchFirebaseError(error)));
  }

  public authenticateWithProvider(
    authProvider: PROVIDER_FIREBASE_AUTH
  ): Observable<IAuthWithProviderResponse> {
    const provider = PROVIDER_FIREBASE_AUTH_INSTANCES[authProvider];

    if (provider instanceof GoogleAuthProvider) {
      provider.setCustomParameters({ prompt: 'select_account' });
    }
    return from(
      signInWithPopup(this._auth, provider).then((userCredential) => {
        const additionalUserInfo = getAdditionalUserInfo(userCredential);
        const isNewUser = additionalUserInfo?.isNewUser || false;

        return {
          userCredential,
          isNewUser,
        };
      })
    ).pipe(catchError((error) => this._catchFirebaseError(error)));
  }

  public signOut(): Observable<void> {
    return from(this._auth.signOut()).pipe(
      catchError((error) => this._catchFirebaseError(error))
    );
  }

  // private _catch;

  private _catchFirebaseError(error: FirebaseError): Observable<never> {
    const formatedError: FirebaseError = {
      ...error,
      message: this._formatErrorMessage(error.code),
    };

    return throwError(() => formatedError);
  }

  private _formatErrorMessage(errorCode: string): string {
    return (
      FIREBASE_ERROR_MESSAGES[errorCode] || FIREBASE_ERROR_MESSAGES['default']
    );
  }
}
