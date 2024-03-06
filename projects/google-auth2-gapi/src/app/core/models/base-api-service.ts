import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { environment } from '@env/google-auth2-gapi/environment.development';
import { Observable } from 'rxjs';

export abstract class BaseApiService {
  private readonly _http: HttpClient = inject(HttpClient);
  private _baseUrl!: string;

  constructor(private baseApi: string) {
    this._baseUrl = `${environment.API_BASE_PATH}/${this.baseApi}`;
  }

  public get<T>(url: string, options?: Object): Observable<T> {
    url = `${this._baseUrl}/${url}`;
    return this._http.get<T>(url, options);
  }

  public post<T>(url: string, body?: Object, options?: Object): Observable<T> {
    url = `${this._baseUrl}/${url}`;
    return this._http.post<T>(url, body, options);
  }

  public put<T>(url: string, body?: Object, options?: Object): Observable<T> {
    url = `${this._baseUrl}/${url}`;
    return this._http.put<T>(url, body, options);
  }

  public delete<T>(url: string, options?: Object): Observable<T> {
    url = `${this._baseUrl}/${url}`;
    return this._http.delete<T>(url, options);
  }
}
