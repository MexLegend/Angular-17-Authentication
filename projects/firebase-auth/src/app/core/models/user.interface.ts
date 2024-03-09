import { WritableSignal } from '@angular/core';

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
}
