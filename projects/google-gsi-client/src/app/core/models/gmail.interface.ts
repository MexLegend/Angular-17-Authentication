import { WritableSignal } from '@angular/core';
import { IError } from '@core/google-gsi-client/models/error.interface';

export interface IGmailState {
  $auth2Client: WritableSignal<any | null>;
  $accessToken: WritableSignal<string | null>;
  $emailsList: WritableSignal<any[]>;
  $isLoadingEmails: WritableSignal<boolean>;
  $emailsError: WritableSignal<IError | null>;
}
