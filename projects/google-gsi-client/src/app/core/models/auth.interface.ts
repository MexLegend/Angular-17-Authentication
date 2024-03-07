import { FormControl } from '@angular/forms';
import { WritableSignal } from '@angular/core';
import { IAuthError } from '@core/google-gsi-client/models/error.interface';

export interface IAuthState {
  $googleAuthAction: WritableSignal<AuthActionType>;
  $googleButtonWrapper: WritableSignal<HTMLButtonElement | null>;
  $isLoadingAuth: WritableSignal<boolean>;
  $authError: WritableSignal<IAuthError | null>;
  $isLoggedIn: WritableSignal<boolean>;
}

export type AuthActionType = 'LOGIN' | 'REGISTER';

export interface ILoginForm {
  email: FormControl<string>;
  password: FormControl<string>;
}

export interface ILoginData {
  email: string;
  password: string;
}

export interface IRegisterForm {
  name: FormControl<string>;
  email: FormControl<string>;
  phone?: FormControl<string>;
  password: FormControl<string>;
  repeatPassword: FormControl<string>;
}

export interface IRegisterData {
  name: string;
  email: string;
  phone?: string;
  password: string;
  repeatPassword: string;
}
