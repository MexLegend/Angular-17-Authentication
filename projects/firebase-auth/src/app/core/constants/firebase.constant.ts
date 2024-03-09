import {
  AuthProvider,
  FacebookAuthProvider,
  GithubAuthProvider,
  GoogleAuthProvider,
  TwitterAuthProvider,
} from '@angular/fire/auth';

export const enum NAME_FIREBASE_COLLECTION {
  USERS = 'users',
}

export type PROVIDER_FIREBASE_AUTH = 'GOOGLE' | 'FACEBOOK' | 'TWITTER' | 'GITHUB';

export const PROVIDER_FIREBASE_AUTH_INSTANCES: Record<PROVIDER_FIREBASE_AUTH, AuthProvider> = {
  'GOOGLE': new GoogleAuthProvider(),
  'FACEBOOK': new FacebookAuthProvider(),
  'TWITTER': new TwitterAuthProvider(),
  'GITHUB': new GithubAuthProvider(),
};

export const FIREBASE_ERROR_MESSAGES: { [errorCode: string]: string } = {
  'auth/email-already-exists': 'The provided email is already in use.',
  'auth/id-token-expired': 'Your session has expired. Please log in again.',
  'auth/id-token-revoked':
    'Your session has been revoked for security reasons. Please log in again.',
  'auth/insufficient-permission':
    'You do not have sufficient permissions to access this feature. Please contact the administrator.',
  'auth/invalid-credential':
    'The provided credentials are invalid. Please try logging in again.',
  'auth/invalid-email':
    'The provided email is not valid. Please verify the address and try again.',
  'auth/invalid-email-verified':
    'Your email has not been verified. Please check your inbox and follow the verification instructions.',
  'auth/invalid-password':
    'The provided password is not valid. Make sure your password meets the security requirements.',
  'auth/maximum-user-count-exceeded':
    'The maximum limit of users has been exceeded. Please contact the system administrator.',
  'auth/phone-number-already-exists':
    'The provided phone number is already in use by another user. Please use a different number.',
  'auth/too-many-requests':
    'Too many requests have been sent. Please wait a moment and try again.',
  'auth/user-not-found':
    'No user associated with this account was found. Please verify the information and try again.',
  default: 'An unexpected error occurred. Please try again later.',
};
