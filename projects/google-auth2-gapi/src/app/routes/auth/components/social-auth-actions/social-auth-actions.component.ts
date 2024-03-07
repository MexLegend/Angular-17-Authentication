import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  Signal,
  inject,
} from '@angular/core';
import { AuthService } from '@core/google-auth2-gapi/services/common/auth.service';
import { AutoDestroyService } from '@core/google-auth2-gapi/services/utils/auto-destroy.service';
import { AuthActionType } from '@core/google-auth2-gapi/models/auth.interface';
import { GoogleIconComponent } from '@shared/google-auth2-gapi/icons/google-icon.component';
import { FacebookBlueIconComponent } from '@shared/google-auth2-gapi/icons/facebook-blue-icon.component';
import { takeUntil } from 'rxjs';
import { IAuthError } from '@core/google-auth2-gapi/models/error.interface';

@Component({
  selector: 'app-social-auth-actions',
  standalone: true,
  imports: [GoogleIconComponent, FacebookBlueIconComponent, NgClass],
  providers: [AutoDestroyService],
  templateUrl: './social-auth-actions.component.html',
  styleUrl: './social-auth-actions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SocialAuthActionsComponent implements OnInit {
  @Input() authAction: AuthActionType = 'LOGIN';

  private readonly _authService = inject(AuthService);
  private readonly _autoDestroyService = inject(AutoDestroyService);
  readonly $isLoading: Signal<boolean> = this._authService.isLoading();

  ngOnInit(): void {
    this._authService.configureGoogleAuthentication();
  }

  authenticateByGoogle() {
    this._authService
      .authenticateByGoogle(this.authAction)
      .pipe(takeUntil(this._autoDestroyService))
      .subscribe({
        next: (userData) => {
          this._authService.authenticateUser(userData);
        },
        error: (error: IAuthError) => {
          this._authService.setAuthError(error);
        },
      });
  }

  authenticateByFacebook() {}
}
