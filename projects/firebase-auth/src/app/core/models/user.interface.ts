import { WritableSignal } from '@angular/core';
import { UserInfo } from '@angular/fire/auth';

export interface IUserState {
  $user: WritableSignal<IUser | null>;
  $isLoadingUser: WritableSignal<boolean>;
}

export type LoginMethod = "CREDENTIALS" | "PROVIDER";

export interface IUser {
  id: string;
  email: string | null;
  emailVerified: boolean;
  name: string | null;
  phoneNumber?: string | null;
  photoURL?: string | null;
  address?: string | null;
  providerData: UserInfo[];
  loginMethod: LoginMethod;
}

export interface IUserAvatar {
  initials: string;
  bgColor: string;
}