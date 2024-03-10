import { IAuthProviders } from '@core/firebase-auth/models';

export const AUTH_PROVIDERS: IAuthProviders[] = [
  {
    id: "google.com",
    method: 'GOOGLE',
    label: 'Google',
    action: () => {},
  },
  {
    id: "facebook.com",
    method: 'FACEBOOK',
    label: 'Facebook',
    action: () => {},
  },
  {
    id: "twitter.com",
    method: 'TWITTER',
    label: 'Twitter',
    action: () => {},
  },
  {
    id: "github.com",
    method: 'GITHUB',
    label: 'Github',
    action: () => {},
  },
];
