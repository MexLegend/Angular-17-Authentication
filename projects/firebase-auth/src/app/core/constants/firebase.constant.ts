import {
  HTTP_ERROR_TYPES,
  FIREBASE_ERROR_TYPES,
  IHttpError,
} from '@core/firebase-auth/models';

export const enum NAME_FIREBASE_COLLECTION {
  USERS = 'users',
  PRODUCTS = 'products',
}

export type PROVIDER_FIREBASE_AUTH =
  | 'GOOGLE'
  | 'FACEBOOK'
  | 'TWITTER'
  | 'GITHUB';

export const FIREBASE_ERROR_MESSAGES: { [errorCode: string]: IHttpError } = {
  'auth/email-already-in-use': {
    httpError: HTTP_ERROR_TYPES.EMAIL_ALREADY_REGISTERED,
    message: 'The provided email is already in use.',
  },
  'auth/account-exists-with-different-credential': {
    httpError: FIREBASE_ERROR_TYPES.ACCOUNUT_ALREADY_REGISTERED,
    message:
      'Email already registered with different credentials. Try another login method.',
  },
  'auth/credential-already-in-use': {
    httpError: FIREBASE_ERROR_TYPES.PROVIDER_ALREADY_REGISTERED,
    message: 'This provider is already in use with a different account.',
  },
  'auth/id-token-expired': {
    httpError: HTTP_ERROR_TYPES.TOKEN_EXPIRED,
    message: 'Your session has expired. Please log in again.',
  },
  'auth/id-token-revoked': {
    httpError: HTTP_ERROR_TYPES.TOKEN_REVOKED,
    message:
      'Your session has been revoked for security reasons. Please log in again.',
  },
  'auth/insufficient-permission': {
    httpError: HTTP_ERROR_TYPES.UNAUTHORIZED,
    message:
      'You do not have sufficient permissions to access this feature. Please contact the administrator.',
  },
  'auth/invalid-credential': {
    httpError: HTTP_ERROR_TYPES.WRONG_CREDENTIALS,
    message:
      'Invalid authentication. Please try again with correct credentials.',
  },
  'auth/invalid-email': {
    httpError: HTTP_ERROR_TYPES.EMAIL_INVALID,
    message:
      'The provided email is not valid. Please verify the address and try again.',
  },
  'auth/invalid-email-verified': {
    httpError: HTTP_ERROR_TYPES.EMAIL_NOT_VERIFIED,
    message:
      'Your email has not been verified. Please check your inbox and follow the verification instructions.',
  },
  'auth/invalid-password': {
    httpError: HTTP_ERROR_TYPES.PASSWORD_INVALID,
    message:
      'The provided password is not valid. Make sure your password meets the security requirements.',
  },
  'auth/weak-password': {
    httpError: HTTP_ERROR_TYPES.PASSWORD_TOO_WEAK,
    message:
      'The provided password is too weak. Make sure your password meets the security requirements.',
  },
  'auth/maximum-user-count-exceeded': {
    httpError: FIREBASE_ERROR_TYPES.MAXIMUM_USER_COUNT,
    message:
      'The maximum limit of users has been exceeded. Please contact the system administrator.',
  },
  'auth/phone-number-already-exists': {
    httpError: FIREBASE_ERROR_TYPES.PHONE_ALREADY_REGISTERED,
    message:
      'The provided phone number is already in use by another user. Please use a different number.',
  },
  'auth/too-many-requests': {
    httpError: HTTP_ERROR_TYPES.TOO_MANY_REQUESTS,
    message:
      'Too many requests have been sent. Please wait a moment and try again.',
  },
  'auth/user-not-found': {
    httpError: HTTP_ERROR_TYPES.NOT_FOUND,
    message:
      'No user associated with this account was found. Please verify the information and try again.',
  },
  default: {
    httpError: HTTP_ERROR_TYPES.SERVER_ERROR,
    message: 'An unexpected error occurred. Please try again later.',
  },
};

export const FIREBASE_WHITELIST_ERRORS = [
  'auth/cancelled-popup-request',
  'auth/popup-closed-by-user',
];
