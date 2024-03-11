import { FormControl } from '@angular/forms';
import { WritableSignal } from '@angular/core';
import { IHttpError } from '@core/firebase-auth/models';

export interface IAuthState {
  $isLoadingAuth: WritableSignal<boolean>;
  $authError: WritableSignal<IHttpError | null>;
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
  phoneNumber?: FormControl<string>;
  password: FormControl<string>;
  confirmPassword: FormControl<string>;
}

export interface IRegisterData {
  name: string;
  email: string;
  phoneNumber?: string;
  password: string;
  confirmPassword: string;
}

export interface ILinkAccountForm {
  password: FormControl<string>;
  confirmPassword: FormControl<string>;
}

export interface ILinkAccountData {
  password: string;
  confirmPassword: string;
}

export interface IResetPasswordForm {
  email: FormControl<string>;
}

export interface IResetPasswordData {
  email: string;
}
