import {
  APP_INITIALIZER,
  EnvironmentProviders,
  makeEnvironmentProviders,
} from '@angular/core';
import { UserService } from '@core/firebase-auth/services/common/user.service';

const loadUserFromFirebase = (userService: UserService) => {
  return () => userService.loadUserFromFirebase();
};

const userProviders: EnvironmentProviders = makeEnvironmentProviders([
  {
    provide: APP_INITIALIZER,
    useFactory: loadUserFromFirebase,
    deps: [UserService],
    multi: true,
  },
]);

export { userProviders };
