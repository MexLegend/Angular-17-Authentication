import { inject, Injectable } from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import { Observable, catchError, from, map, throwError } from 'rxjs';
import { FIREBASE_ERROR_MESSAGES } from '@core/firebase-auth/constants';
import {
  doc,
  docData,
  Firestore,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { IUser } from '@core/firebase-auth/models';
import { NAME_FIREBASE_COLLECTION } from '@core/firebase-auth/constants/firebase.constant';

@Injectable({
  providedIn: 'root',
})
export class FirebaseStoreService {
  private readonly _fireStore: Firestore = inject(Firestore);

  public addUser(user: IUser): Observable<any> {
    const ref = doc(this._fireStore, NAME_FIREBASE_COLLECTION.USERS, user.id);
    return from(setDoc(ref, { ...user })).pipe(
      catchError((error) => {
        return this._catchFirebaseError(error);
      })
    );
  }

  public getUser(userId: string): Observable<IUser> {
    const ref = doc(this._fireStore, NAME_FIREBASE_COLLECTION.USERS, userId);
    return (docData(ref) as Observable<IUser>).pipe(
      catchError((error) => this._catchFirebaseError(error))
    );
  }

  public updateUser(user: IUser): Observable<any> {
    const ref = doc(this._fireStore, NAME_FIREBASE_COLLECTION.USERS, user.id);
    return from(updateDoc(ref, { ...user })).pipe(
      catchError((error) => this._catchFirebaseError(error))
    );
  }

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
