import { IFirebaseErrorCustomData } from "./firebase.interface";

export enum HTTP_ERROR_TYPES {
  ACCOUNT_NOT_VERIFIED = 'ACCOUNT_NOT_VERIFIED',
  EMAIL_ALREADY_REGISTERED = 'EMAIL_ALREADY_REGISTERED',
  CONFLICT = 'CONFLICT',
  NOT_FOUND = 'NOT_FOUND',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  SERVER_ERROR = 'SERVER_ERROR',
  BAD_REQUEST_ERROR = 'BAD_REQUEST_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  WRONG_CREDENTIALS = 'WRONG_CREDENTIALS',
}

export interface IHttpError<T = HTTP_ERROR_TYPES> {
  readonly httpError: T;
  readonly httpStatus?: number;
  readonly message: string;
  readonly customData?: IFirebaseErrorCustomData;
}