import { HttpClient } from '@angular/common/http';
import {
  Injectable,
  NgZone,
  Signal,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';
import {
  GOOGLE_API_AUTH_SCOPES,
  GOOGLE_API_URL_USERS,
} from '@core/google-gsi-client/constants';
import { environment } from '@env/google-gsi-client/environment';
import { Observable, finalize, forkJoin, map, mergeMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GmailService {
  private readonly _ngZone = inject(NgZone);
  private readonly _http = inject(HttpClient);

  private readonly _authClient: WritableSignal<any> = signal(null);
  private readonly _accessToken: WritableSignal<string> = signal('');
  private readonly _googleUserId: WritableSignal<string> = signal('');
  private readonly _isLoading: WritableSignal<boolean> = signal(false);
  readonly _emailsList: WritableSignal<any[]> = signal([]);

  constructor() {
    this._configureGoogleAuthorization();
  }

  _configureGoogleAuthorization() {
    const auth2Client = (google.accounts as any).oauth2.initTokenClient({
      client_id: environment.GOOGLE_CLIENT_ID,
      scope: `${GOOGLE_API_AUTH_SCOPES.GMAIL_READONLY}`,
      ux_mode: 'popup',
      callback: ({ access_token }: any) => {
        this._ngZone.run(() => {
          this._accessToken.set(access_token);
          this.requestEmails();
        });
      },
    });

    this._authClient.set(auth2Client);
  }

  accessToken(): string {
    return this._accessToken();
  }

  isLoading(): Signal<boolean> {
    return this._isLoading.asReadonly();
  }

  getEmails(): Signal<any[]> {
    return this._emailsList.asReadonly();
  }

  fetchEmails(googleUserId: string): void {
    this._googleUserId.set(googleUserId);
    this._authClient().requestAccessToken();
  }

  requestEmails(maxResults = 5): void {
    this._isLoading.set(true);
    this._http
      .get<any>(
        `${GOOGLE_API_URL_USERS}/${this._googleUserId()}/messages?maxResults=${maxResults}`
      )
      .pipe(
        map((resp) => resp.messages),
        mergeMap((messages: any[]) =>
          forkJoin(
            messages.map((message) =>
              this.getEmailById(this._googleUserId(), message.id)
            )
          )
        ),
        finalize(() => this._isLoading.set(false))
      )
      .subscribe({
        next: console.log,
      });
  }

  getEmailById(userId: string, mailId: string): Observable<any> {
    return this._http.get(
      `${GOOGLE_API_URL_USERS}/${userId}/messages/${mailId}`
    );
  }
}
