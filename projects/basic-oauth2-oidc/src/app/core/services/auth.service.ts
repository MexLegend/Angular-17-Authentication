import { Injectable, inject } from '@angular/core';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { Observable, of } from 'rxjs';
import { environment } from '@env/advanced-auth/environment.development';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _oAuthService = inject(OAuthService);
  private readonly _router = inject(Router);

  constructor() {
    this._initGoogleLogin();
  }

  private _initGoogleLogin() {
    const config: AuthConfig = {
      issuer: 'https://accounts.google.com',
      strictDiscoveryDocumentValidation: false,
      clientId: environment.googleClientId,
      redirectUri: window.location.origin + '/home',
      scope: 'openid profile email',
    };

    this._oAuthService.configure(config);
    this._oAuthService.setupAutomaticSilentRefresh();
    this._oAuthService.loadDiscoveryDocumentAndTryLogin();
  }

  login() {
    this._oAuthService.initLoginFlow();
  }

  logout() {
    this._oAuthService.logOut();
    this._router.navigateByUrl('/');
  }

  getUser(): Record<string, any> | null {
    return this._oAuthService.getIdentityClaims();
  }

  getAuthToken(): Observable<boolean> {
    console.log(this._oAuthService.getAccessToken());

    return of(true);
  }
}
