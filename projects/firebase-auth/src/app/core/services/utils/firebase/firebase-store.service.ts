import { inject, Injectable } from '@angular/core';
import { Observable, catchError, from } from 'rxjs';
import {
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  docData,
  Firestore,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { IUpdateDocumentData } from '@core/firebase-auth/models';
import { catchFirebaseError } from '@core/firebase-auth/helpers';

@Injectable({
  providedIn: 'root',
})
export class FirebaseStoreService {
  private readonly _fireStore: Firestore = inject(Firestore);

  public addDocument<T>(
    collectionName: string,
    data: IUpdateDocumentData<any>
  ): Observable<T> {
    const collectionRef = collection(this._fireStore, collectionName);
    return from(addDoc(collectionRef, data) as Promise<T>).pipe(
      catchError((error) => {
        return catchFirebaseError(error);
      })
    );
  }

  public setDocumentById<T>(
    collectionName: string,
    id: string,
    data: IUpdateDocumentData<any>
  ): Observable<T> {
    const ref = doc(this._fireStore, collectionName, id);
    return from(setDoc(ref, data) as Promise<T>).pipe(
      catchError((error) => {
        return catchFirebaseError(error);
      })
    );
  }

  public getOneDocument<T>(collectionName: string, id: string): Observable<T> {
    const ref = doc(this._fireStore, collectionName, id);
    return (docData(ref, { idField: 'id' }) as Observable<T>).pipe(
      catchError((error) => catchFirebaseError(error))
    );
  }

  public getAllDocuments<T>(collectionName: string): Observable<T> {
    const collectionRef = collection(this._fireStore, collectionName);
    return collectionData(collectionRef, { idField: 'id' }) as Observable<T>;
  }

  public updateDocumentById<T>(
    collectionName: string,
    id: string,
    data: IUpdateDocumentData<any>
  ): Observable<T> {
    const ref = doc(this._fireStore, collectionName, id);
    return from(updateDoc(ref, data) as Promise<T>).pipe(
      catchError((error) => catchFirebaseError(error))
    );
  }

  public deleteDocumentById(
    collectionName: string,
    id: string
  ): Observable<void> {
    const ref = doc(this._fireStore, collectionName, id);
    return from(deleteDoc(ref)).pipe(
      catchError((error) => catchFirebaseError(error))
    );
  }
}
