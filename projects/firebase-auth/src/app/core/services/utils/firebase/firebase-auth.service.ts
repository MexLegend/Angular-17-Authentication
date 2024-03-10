import { inject, Injectable } from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import {
  Auth,
  AuthCredential,
  AuthProvider,
  FacebookAuthProvider,
  GithubAuthProvider,
  GoogleAuthProvider,
  OAuthProvider,
  TwitterAuthProvider,
  User,
  UserCredential,
  authState,
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  getAdditionalUserInfo,
  linkWithCredential,
  linkWithPopup,
  signInWithEmailAndPassword,
  signInWithPopup,
  unlink,
} from '@angular/fire/auth';
import {
  EMPTY,
  Observable,
  catchError,
  from,
  map,
  switchMap,
  throwError,
} from 'rxjs';
import {
  FIREBASE_ERROR_MESSAGES,
  FIREBASE_WHITELIST_ERRORS,
  PROVIDER_FIREBASE_AUTH,
} from '@core/firebase-auth/constants';
import {
  HTTP_ERROR_TYPES,
  IAuthError,
  IAuthWithProviderResponse,
  ILoginData,
  IRegisterData,
} from '@core/firebase-auth/models';

@Injectable({
  providedIn: 'root',
})
export class FirebaseAuthService {
  private readonly _auth: Auth = inject(Auth);

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
    const provider = this._getProviderAuthInstance(authProvider);

    if (provider instanceof GoogleAuthProvider) {
      provider.setCustomParameters({ prompt: 'select_account' });
    }

    return this._signInWithPopup(provider);
  }

  public signOut(): Observable<void> {
    return from(this._auth.signOut()).pipe(
      catchError((error) => this._catchFirebaseError(error))
    );
  }

  public linkOrUnlinkAccount(
    authProvider: PROVIDER_FIREBASE_AUTH
  ): Observable<User> {
    const user = this._auth.currentUser;

    if (!user)
      return throwError(
        () =>
          ({
            httpError: HTTP_ERROR_TYPES.UNAUTHORIZED,
            message: 'User not logged in',
          } as IAuthError)
      );

    const provider = this._getProviderAuthInstance(authProvider);
    const providerId = this._getExistingProviderId(user, provider.providerId);

    if (providerId) return this._unlinkAccount(user, providerId);
    else return this._linkAccount(user, provider);
  }

  private _linkAccount(user: User, provider: AuthProvider): Observable<User> {
    return this._linkWithPopup(user, provider).pipe(
      map((resp) => resp.user),
      catchError((error) => this._catchFirebaseError(error))
    );
  }

  private _unlinkAccount(user: User, providerId: string): Observable<User> {
    return from(unlink(user, providerId)).pipe(
      catchError((error) => this._catchFirebaseError(error))
    );
  }

  private _linkWithPopup(
    user: User,
    provider: AuthProvider
  ): Observable<UserCredential> {
    return from(linkWithPopup(user, provider)).pipe(
      catchError((error) => this._catchFirebaseError(error))
    );
  }

  private _linkWithCredential(
    user: User,
    credential: AuthCredential
  ): Observable<UserCredential> {
    return from(linkWithCredential(user, credential)).pipe(
      catchError((error) => this._catchFirebaseError(error))
    );
  }

  private _signInWithPopup(
    provider: AuthProvider
  ): Observable<IAuthWithProviderResponse> {
    return from(
      signInWithPopup(this._auth, provider).then((userCredential) => {
        const additionalUserInfo = getAdditionalUserInfo(userCredential);
        const isNewUser = additionalUserInfo?.isNewUser || false;

        return {
          userCredential,
          isNewUser,
        };
      })
    ).pipe(catchError((error) => this._catchFirebaseLinkedAccountError(error)));
  }

  private _getProviderAuthInstance(
    authProvider: PROVIDER_FIREBASE_AUTH
  ): AuthProvider {
    return {
      GOOGLE: new GoogleAuthProvider(),
      FACEBOOK: new FacebookAuthProvider(),
      TWITTER: new TwitterAuthProvider(),
      GITHUB: new GithubAuthProvider(),
    }[authProvider];
  }

  private _getExistingProviderId(
    user: User,
    providerId: string
  ): string | null {
    const provider = user.providerData.find(
      (provider) => provider.providerId === providerId
    );
    return provider?.providerId || null;
  }

  private _catchFirebaseLinkedAccountError(
    error: FirebaseError
  ): Observable<IAuthWithProviderResponse | never> {
    if (error.code === 'auth/account-exists-with-different-credential') {
      const providerId = error.customData?.['providerId'] as string;
      const accessToken = error.customData?.['oauthAccessToken'] as string;
      const pendingCred = new OAuthProvider(providerId).credential({
        accessToken,
      });
      const email = error.customData?.['email'] as string;
      // Get the sign-in methods for this email.
      return from(fetchSignInMethodsForEmail(this._auth, email)).pipe(
        switchMap((methods) => {
          // If the user has several sign-in methods, the first method
          // in the list will be the "recommended" method to use.
          if (methods[0] === 'password') {
            // TODO: Ask the user for their password.
            // In real scenario, you should handle this asynchronously.
            const password = '';
            return this.signInWithEmailAndPassword({ email, password }).pipe(
              switchMap(({ user }) =>
                this._linkWithCredential(user, pendingCred)
              )
            );
          }

          // All other cases are external providers.
          // Construct provider object for that provider.
          // TODO: Implement getProviderForProviderId.
          var provider = getProviderForProviderId(methods[0]);

          // At this point, you should let the user know that they already have an
          // account with a different provider, and validate they want to sign in
          // with the new provider.
          return this._signInWithPopup(provider).pipe(
            switchMap(({ userCredential: { user } }) =>
              this._linkWithCredential(user, pendingCred)
            )
          );
        }),
        map((userCredential) => ({
          userCredential,
          isNewUser: false,
        }))
      );
    }

    // Propagate Error
    return this._catchFirebaseError(error);
  }

  private _catchFirebaseError(error: FirebaseError): Observable<never> {
    const formatedError: FirebaseError = {
      ...error,
      message: this._formatErrorMessage(error.code),
    };

    // Handle whitelist errors
    if (FIREBASE_WHITELIST_ERRORS.includes(error.code)) {
      return EMPTY;
    }

    return throwError(() => formatedError);
  }

  private _formatErrorMessage(errorCode: string): string {
    return (
      FIREBASE_ERROR_MESSAGES[errorCode] || FIREBASE_ERROR_MESSAGES['default']
    );
  }
}
