import { WritableSignal } from '@angular/core';
import { UserInfo } from '@angular/fire/auth';

export interface IUserState {
  $user: WritableSignal<IUser | null>;
  $isLoadingUser: WritableSignal<boolean>;
}

export interface IUser {
  id: string;
  email: string | null;
  emailVerified: boolean;
  name: string | null;
  phoneNumber?: string | null;
  photoURL?: string | null;
  address?: string | null;
  providerData: UserInfo[];
}

export interface IUserAvatar {
  initials: string;
  bgColor: string;
}