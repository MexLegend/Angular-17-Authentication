import { Injectable, inject } from '@angular/core';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { environment } from '@env/advanced-auth/environment.development';
import { SCOPE_GMAIL_AUTH, GOOGLE_API } from '@core/advanced-auth/constants';

import {
  IGoogleUserInfo,
  IUser,
} from '@core/advanced-auth/models/user.interface';
import { UserService } from './user.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _router = inject(Router);

  private readonly _oAuthService = inject(OAuthService);
  private readonly _userService = inject(UserService);

  configureGoogleAuthentication() {
    const config: AuthConfig = {
      issuer: GOOGLE_API,
      strictDiscoveryDocumentValidation: false,
      clientId: environment.googleClientId,
      redirectUri: window.location.origin + '/home',
      scope: `openid profile email ${SCOPE_GMAIL_AUTH}`,
    };

    this._oAuthService.configure(config);
    this._oAuthService.setupAutomaticSilentRefresh();
    this._oAuthService.loadDiscoveryDocumentAndTryLogin().then(() => {
      if (this._oAuthService.hasValidAccessToken()) {
        this.loadUserData();
      }
    });
  }

  loadUserData(): IUser | null {
    const userInfo = this._oAuthService.getIdentityClaims() as IGoogleUserInfo;

    const userData: IUser = {
      id: userInfo.sub,
      email: userInfo.email,
      name: userInfo.name,
      image: userInfo.picture,
    };

    this._userService.setUserData(userData);

    return userData;
  }

  isLoggedIn(): boolean {
    return this._oAuthService.hasValidAccessToken();
  }

  authenticateByGoogle() {
    this._oAuthService.initLoginFlow();
  }

  signOut(): void {
    this._oAuthService.logOut();
    this._userService.setUserData(null);
    this._router.navigateByUrl('/auth');
  }
}
