import { Injectable, inject, signal } from '@angular/core';
import { LocalStorageService } from '../utils/local-storage.service';
import { KEY_STORAGE } from '@core/google-gsi-client/constants';
import {
  IUser,
  IUserState,
} from '@core/google-gsi-client/models/user.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly _userState: IUserState = {
    $user: signal<IUser | null>(null),
  } as const;

  readonly $user = this._userState.$user.asReadonly();

  private readonly _storageService = inject(LocalStorageService);

  setUserData(userData: IUser | null): void {
    this._userState.$user.set(userData);
  }

  updateStorage(userData: IUser): void {
    this._storageService.setItem(KEY_STORAGE.DATA_USER, userData);
  }
}
