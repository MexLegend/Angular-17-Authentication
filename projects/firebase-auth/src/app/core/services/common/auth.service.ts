import { Injectable, inject, signal } from '@angular/core';

import { ILoginData, IRegisterData, IUser } from '@core/firebase-auth/models';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AUTH_REDIRECT,
  PROVIDER_FIREBASE_AUTH,
} from '@core/firebase-auth/constants';
import { Observable, finalize, map, of, switchMap } from 'rxjs';
import { IAuthError } from '@core/firebase-auth/models';
import { IAuthState } from '@core/firebase-auth/models';
import { BaseApiService } from '@core/firebase-auth/models';
import { FirebaseAuthService } from '@core/firebase-auth/services/utils/firebase/firebase-auth.service';
import { FirebaseStoreService } from '@core/firebase-auth/services/utils/firebase/firebase-store.service';
import { UserCredential } from '@angular/fire/auth';
import { AuthActionType } from '@core/firebase-auth/models/auth.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends BaseApiService {
  private readonly _router = inject(Router);
  private readonly _activatedRoute = inject(ActivatedRoute);

  private readonly _firebaseAuthService = inject(FirebaseAuthService);
  private readonly _firebaseStoreService = inject(FirebaseStoreService);

  private readonly _authState: IAuthState = {
    $isLoadingAuth: signal<boolean>(false),
    $authError: signal<IAuthError | null>(null),
  } as const;

  readonly isLoggedIn$ = this._firebaseAuthService._$authState.pipe(
    map((res) => !!res)
  );
  readonly $isLoadingAuth = this._authState.$isLoadingAuth.asReadonly();
  readonly $authError = this._authState.$authError.asReadonly();

  constructor() {
    super('auth');
  }

  setIsLoading(isLoading: boolean): void {
    this._authState.$isLoadingAuth.set(isLoading);
  }

  setAuthError(error: IAuthError | null): void {
    this._authState.$authError.set(error);
  }

  authenticateUser(): void {
    const redirectUrl =
      this._activatedRoute.snapshot.queryParams[AUTH_REDIRECT];
    this._router.navigateByUrl(redirectUrl || '/');
  }

  authenticateWithProvider(
    authProvider: PROVIDER_FIREBASE_AUTH
  ) {
    return this._firebaseAuthService
      .authenticateWithProvider(authProvider)
      .pipe(
        // Store user in database
        switchMap(({ isNewUser, userCredential: {user} }) => {      
          if (isNewUser) {
            return this._firebaseStoreService.addUser({
              id: user.uid,
              email: user.email,
              emailVerified: user.emailVerified,
              name: user.displayName,
              phoneNumber: user.phoneNumber,
              photoURL: user.photoURL,
            });
          }
          return of(user);
        }),
        finalize(() => this.setIsLoading(false))
      );
  }

  public signUpWithEmailAndPassword(
    registerData: IRegisterData
  ): Observable<IUser> {
    this.setAuthError(null);
    this.setIsLoading(true);

    return this._firebaseAuthService
      .signUpWithEmailAndPassword(registerData)
      .pipe(
        // Store user in database
        switchMap(({ user: { uid, emailVerified } }) => {
          const { password, confirmPassword, ...userData } = registerData;
          return this._firebaseStoreService.addUser({
            ...userData,
            id: uid,
            emailVerified,
          });
        }),
        finalize(() => this.setIsLoading(false))
      );
  }

  public signInWithEmailAndPassword(
    loginData: ILoginData
  ): Observable<UserCredential> {
    this.setAuthError(null);
    this.setIsLoading(true);

    return this._firebaseAuthService
      .signInWithEmailAndPassword(loginData)
      .pipe(finalize(() => this.setIsLoading(false)));
  }

  signOut(): Observable<void> {
    return this._firebaseAuthService.signOut().pipe(
      finalize(() => {
        this._router.navigateByUrl('/auth');
      })
    );
  }
}