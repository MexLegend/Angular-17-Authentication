import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone, inject, signal } from '@angular/core';
import {
  GOOGLE_API_AUTH_SCOPES,
  GOOGLE_API_URL_USERS,
} from '@core/google-gsi-client/constants';
import { environment } from '@env/google-gsi-client/environment';
import { Observable, finalize, forkJoin, map, mergeMap } from 'rxjs';
import { IError } from '@core/google-gsi-client/models/error.interface';
import { IGmailState } from '@core/google-gsi-client/models/gmail.interface';

@Injectable({
  providedIn: 'root',
})
export class GmailService {
  private readonly _gmailState: IGmailState = {
    $auth2Client: signal<any | null>(null),
    $accessToken: signal<string | null>(null),
    $emailsList: signal<any[]>([]),
    $isLoadingEmails: signal<boolean>(false),
    $emailsError: signal<IError | null>(null),
  } as const;

  readonly $accessToken = this._gmailState.$accessToken.asReadonly();
  readonly $emailsList = this._gmailState.$emailsList.asReadonly();
  readonly $isLoadingEmails = this._gmailState.$isLoadingEmails.asReadonly();
  readonly $emailError = this._gmailState.$emailsError.asReadonly();

  private readonly _ngZone = inject(NgZone);
  private readonly _http = inject(HttpClient);

  constructor() {
    this._configureGoogleAuthorization();
  }

  requestAccessToken(): void {
    this._gmailState.$auth2Client().requestAccessToken();
  }

  private _setEmailsList(emails: any[]): void {
    this._gmailState.$emailsList.set(emails);
  }

  private _setIsLoading(isLoading: boolean): void {
    this._gmailState.$isLoadingEmails.set(isLoading);
  }

  private _setEmailsError(error: IError): void {
    this._gmailState.$emailsError.set(error);
  }

  private _configureGoogleAuthorization() {
    const auth2Client = (google.accounts as any).oauth2.initTokenClient({
      client_id: environment.GOOGLE_CLIENT_ID,
      scope: `${GOOGLE_API_AUTH_SCOPES.GMAIL_READONLY}`,
      ux_mode: 'popup',
      callback: ({ access_token }: any) => {
        this._ngZone.run(() => {
          this._gmailState.$accessToken.set(access_token);
        });
      },
    });
    this._gmailState.$auth2Client.set(auth2Client);
  }

  getEmails(googleUserId: string): void {
    this._fetchEmails(googleUserId).subscribe({
      next: (emails) => this._setEmailsList(emails),
      error: (error) => {
        this._setEmailsError(error);
        this._setIsLoading(false);
      },
    });
  }

  private _fetchEmails(
    googleUserId: string,
    maxResults = 5
  ): Observable<any[]> {
    this._setIsLoading(true);
    const url = `${GOOGLE_API_URL_USERS}/${googleUserId}/messages?maxResults=${maxResults}`;

    return this._http.get<any>(url).pipe(
      map((resp) => resp.messages),
      mergeMap((messages: any[]) =>
        forkJoin(
          messages.map((message) =>
            this._getEmailById(googleUserId, message.id)
          )
        )
      ),
      finalize(() => this._setIsLoading(false))
    );
  }

  private _getEmailById(userId: string, mailId: string): Observable<any> {
    const url = `${GOOGLE_API_URL_USERS}/${userId}/messages/${mailId}`;
    return this._http.get(url);
  }
}
