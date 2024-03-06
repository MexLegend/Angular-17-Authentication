export interface IUser {
  id: string;
  googleUserId?: string;
  email: string;
  name: string;
  phone?: string;
  image?: String;
}

export interface IGoogleUserInfo {
  aud: string;
  azp: string;
  email: string;
  email_verified: boolean;
  exp: number;
  family_name: string;
  given_name: string;
  iat: number;
  iss: string;
  jti: string;
  locale: string;
  name: string;
  nbf: number;
  picture: string;
  sub: string;
}
