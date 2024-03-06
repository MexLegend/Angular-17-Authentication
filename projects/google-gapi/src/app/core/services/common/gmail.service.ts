import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  Injectable,
  Signal,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';
import { URL_USERS } from '@core/google-gapi/constants';
import { OAuthService } from 'angular-oauth2-oidc';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable, finalize, forkJoin, map, mergeMap } from 'rxjs';
import {
  IGmailMailDetails,
  IGmailResponse,
} from '@core/google-gapi/models/gmail.interface';

@Injectable({
  providedIn: 'root',
})
export class GmailService {
  private readonly _http = inject(HttpClient);
  private readonly _oAuthService = inject(OAuthService);
  private readonly _isLoading: WritableSignal<boolean> = signal(false);

  getIsLoading(): Signal<boolean> {
    return this._isLoading.asReadonly();
  }

  getEmails(userId: string, maxResults = 5): Signal<IGmailMailDetails[]> {
    this._isLoading.set(true);
    return toSignal(
      this._http
        .get<IGmailResponse>(
          `${URL_USERS}/${userId}/messages?maxResults=${maxResults}`,
          {
            headers: this._authHeader(),
          }
        )
        .pipe(
          map((resp) => resp.messages),
          mergeMap((messages) =>
            forkJoin(messages.map((x) => this.getEmailById(userId, x.id)))
          ),
          finalize(() => this._isLoading.set(false))
        ),
      {
        initialValue: [],
      }
    );
  }

  getEmailById(userId: string, mailId: string): Observable<any> {
    return this._http.get(`${URL_USERS}/${userId}/messages/${mailId}`, {
      headers: this._authHeader(),
    });
  }

  private _authHeader(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this._oAuthService.getAccessToken()}`,
    });
  }
}
