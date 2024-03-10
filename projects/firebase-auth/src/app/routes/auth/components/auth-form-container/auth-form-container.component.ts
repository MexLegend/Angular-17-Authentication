import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Signal,
  booleanAttribute,
  inject,
} from '@angular/core';
import { SocialAuthActionsComponent } from '../social-auth-actions/social-auth-actions.component';
import { HttpErrorComponent } from '@shared/firebase-auth/components/http-error/auth-form-error.component';
import { AuthActionType } from '@core/firebase-auth/models';
import { AuthService } from '@core/firebase-auth/services/common/auth.service';
import { IHttpError } from '@core/firebase-auth/models/';

@Component({
  selector: 'app-auth-form-container',
  standalone: true,
  imports: [HttpErrorComponent, SocialAuthActionsComponent],
  templateUrl: './auth-form-container.component.html',
  styleUrl: './auth-form-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthFormContainerComponent {
  @Input() authAction: AuthActionType = 'LOGIN';
  @Input({ transform: booleanAttribute }) hideSocialAuthActions: boolean =
    false;

  private readonly _authService = inject(AuthService);
  readonly $authError: Signal<IHttpError | null> = this._authService.$authError;
}
