import { Component, Input, Signal, inject } from '@angular/core';
import { SocialAuthActionsComponent } from '../social-auth-actions/social-auth-actions.component';
import { AuthFormErrorComponent } from '../auth-form-error/auth-form-error.component';
import { AuthActionType } from '@core/google-auth2-gapi/models/auth.interface';
import { AuthService } from '@core/google-auth2-gapi/services/common/auth.service';
import { IAuthError } from '@core/google-auth2-gapi/models/error.interface';

@Component({
  selector: 'app-auth-form-container',
  standalone: true,
  imports: [AuthFormErrorComponent, SocialAuthActionsComponent],
  templateUrl: './auth-form-container.component.html',
  styleUrl: './auth-form-container.component.scss',
})
export class AuthFormContainerComponent {
  @Input({ required: true }) title!: string;
  @Input() authAction: AuthActionType = 'LOGIN';

  private readonly _authService = inject(AuthService);
  readonly $authError: Signal<IAuthError | null> =
    this._authService.selectAuthError();
}
