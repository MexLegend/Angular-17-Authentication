import { Injectable, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NAME_FIREBASE_COLLECTION } from '@core/firebase-auth/constants';
import { IUser, IUserState } from '@core/firebase-auth/models';
import { FirebaseAuthService } from '@core/firebase-auth/services/utils/firebase/firebase-auth.service';
import { FirebaseStoreService } from '@core/firebase-auth/services/utils/firebase/firebase-store.service';
import { map, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly _firebaseAuthService = inject(FirebaseAuthService);
  private readonly _firebaseStoreService = inject(FirebaseStoreService);

  // State
  private readonly _userState: IUserState = {
    $user: signal<IUser | null>(null),
    $isLoadingUser: signal<boolean>(false),
  } as const;

  // Selectors
  readonly $user = this._userState.$user.asReadonly();

  // Reducers
  constructor(){
    this.getCurrentUser();
  }

  getCurrentUser(): void {
    this._setIsLoading(true);

    this._firebaseAuthService._$authState
      .pipe(
        takeUntilDestroyed(),
        switchMap((user) => {
          if (!user?.uid) {
            return of(null);
          }
          return this._firebaseStoreService
            .getOneDocumentById<IUser>(NAME_FIREBASE_COLLECTION.USERS, user.uid)
            .pipe(
              map((resp) => ({
                ...resp,
                photoURL: resp?.photoURL || user.photoURL,
                providerData: user.providerData,
              }))
            );
        })
      )
      .subscribe({
        next: (user) => {
          this.setUserData(user);
          this._setIsLoading(false);
        },
        error: (error) => {
          console.error(error);
          this._setIsLoading(false);
        },
      });
  }

  private _setIsLoading(isLoading: boolean) {
    this._userState.$isLoadingUser.set(isLoading);
  }

  setUserData(userData: IUser | null): void {
    this._userState.$user.set(userData);
  }
}
