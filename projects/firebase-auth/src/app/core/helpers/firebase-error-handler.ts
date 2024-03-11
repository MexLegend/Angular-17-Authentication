import { FirebaseError } from '@angular/fire/app';
import { EMPTY, Observable, throwError } from 'rxjs';
import {
  FIREBASE_ERROR_MESSAGES,
  FIREBASE_WHITELIST_ERRORS,
} from '@core/firebase-auth/constants';
import { IHttpError } from '@core/firebase-auth/models';

export const catchFirebaseError = (error: FirebaseError): Observable<never> => {
  // Handle whitelist errors
  if (FIREBASE_WHITELIST_ERRORS.includes(error.code)) {
    return EMPTY;
  }

  return throwError(() => formatErrorMessage(error.code));
};

export const formatErrorMessage = (errorCode: string): IHttpError => {
  return (
    FIREBASE_ERROR_MESSAGES[errorCode] || FIREBASE_ERROR_MESSAGES['default']
  );
};
