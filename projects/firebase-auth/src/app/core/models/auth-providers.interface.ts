import { PROVIDER_FIREBASE_AUTH } from '@core/firebase-auth/constants';

export interface IAuthProviders {
  id: string;
  method: PROVIDER_FIREBASE_AUTH;
  label: string;
  action: () => void;
}
