import { inject, Injectable } from '@angular/core';
import { Observable, catchError, from } from 'rxjs';
import {
  doc,
  docData,
  DocumentData,
  Firestore,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { IUser } from '@core/firebase-auth/models';
import { NAME_FIREBASE_COLLECTION } from '@core/firebase-auth/constants/firebase.constant';
import { catchFirebaseError } from '@core/firebase-auth/helpers';

@Injectable({
  providedIn: 'root',
})
export class FirebaseStoreService {
  private readonly _fireStore: Firestore = inject(Firestore);

  public addUser(user: IUser): Observable<any> {
    const ref = doc(this._fireStore, NAME_FIREBASE_COLLECTION.USERS, user.id);
    return from(setDoc(ref, { ...user })).pipe(
      catchError((error) => {
        return catchFirebaseError(error);
      })
    );
  }

  public getOneDocument<T>(collectionName: string, id: string): Observable<T> {
    const ref = doc(this._fireStore, collectionName, id);
    return (docData(ref) as Observable<T>).pipe(
      catchError((error) => catchFirebaseError(error))
    );
  }

  public updateDocumentById<T>(
    collectionName: string,
    id: string,
    data: T
  ): Observable<any> {
    const ref = doc(this._fireStore, collectionName, id);
    return from(updateDoc<DocumentData>(ref, data)).pipe(
      catchError((error) => catchFirebaseError(error))
    );
  }
}
