import { OAuthCredential, UserCredential } from '@angular/fire/auth';

export interface IAuthWithProviderResponse {
  userCredential: UserCredential;
  isNewUser: boolean;
}

export interface IFirebaseErrorCustomData {
  shouldRequestLinkAccount: boolean;
  email: string;
  pendingCredential: OAuthCredential;
}
