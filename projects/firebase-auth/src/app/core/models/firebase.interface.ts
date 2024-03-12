import { UserCredential } from '@angular/fire/auth';

export interface IAuthWithProviderResponse {
  userCredential: UserCredential;
  isNewUser: boolean;
}

export interface IFirebaseErrorCustomData {
  shouldRequestLinkAccount: boolean;
  email: string;
  accessToken: string;
  providerId: string;
}

export interface IUpdateDocumentData<T> {
  [key: string]: T;
}