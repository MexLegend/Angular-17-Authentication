export interface IUser {
  id: string;
  email: string;
  name: string;
  phone?: string;
  image?: String;
}

export interface IGoogleUserInfo {
  sub: string;
  email: string;
  name: string;
  picture: string;
}
