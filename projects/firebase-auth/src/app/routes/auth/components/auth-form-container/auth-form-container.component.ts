import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Signal,
  inject,
} from '@angular/core';
import { SocialAuthActionsComponent } from '../social-auth-actions/social-auth-actions.component';
import { AuthFormErrorComponent } from '../auth-form-error/auth-form-error.component';
import { AuthActionType } from '@core/firebase-auth/models';
import { AuthService } from '@core/firebase-auth/services/common/auth.service';
import { IAuthError } from '@core/firebase-auth/models/';

@Component({
  selector: 'app-auth-form-container',
  standalone: true,
  imports: [AuthFormErrorComponent, SocialAuthActionsComponent],
  templateUrl: './auth-form-container.component.html',
  styleUrl: './auth-form-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthFormContainerComponent {
  @Input({ required: true }) title!: string;
  @Input() authAction: AuthActionType = 'LOGIN';

  private readonly _authService = inject(AuthService);
  readonly $authError: Signal<IAuthError | null> = this._authService.$authError;
}
