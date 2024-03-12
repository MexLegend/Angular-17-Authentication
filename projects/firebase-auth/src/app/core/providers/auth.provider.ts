import {
  APP_INITIALIZER,
  EnvironmentProviders,
  makeEnvironmentProviders,
} from '@angular/core';
import { AuthService } from '@core/firebase-auth/services/common/auth.service';

const verifyUserAuthenticationStatus = (authService: AuthService) => {
  // return () => authService.verifyUserAuthenticationStatus();
};

const authProviders: EnvironmentProviders = makeEnvironmentProviders([
  {
    provide: APP_INITIALIZER,
    useFactory: verifyUserAuthenticationStatus,
    deps: [AuthService],
    multi: true,
  },
]);

export { authProviders };
