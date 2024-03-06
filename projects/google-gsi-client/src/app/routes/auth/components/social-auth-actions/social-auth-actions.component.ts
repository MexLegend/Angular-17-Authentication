import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  Signal,
  inject,
} from '@angular/core';
import { AuthService } from '@core/google-gsi-client/services/common/auth.service';
import { AuthActionType } from '@core/google-gsi-client/models/auth.interface';
import { GoogleIconComponent } from '@shared/google-gsi-client/icons/google-icon.component';
import { FacebookBlueIconComponent } from '@shared/google-gsi-client/icons/facebook-blue-icon.component';

@Component({
  selector: 'app-social-auth-actions',
  standalone: true,
  imports: [GoogleIconComponent, FacebookBlueIconComponent, NgClass],
  providers: [],
  templateUrl: './social-auth-actions.component.html',
  styleUrl: './social-auth-actions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SocialAuthActionsComponent implements OnInit {
  @Input() authAction: AuthActionType = 'LOGIN';

  private readonly _authService = inject(AuthService);
  readonly $isLoading: Signal<boolean> = this._authService.getIsLoading();

  ngOnInit(): void {
    this._authService.initGoogleAuthConfig(this.authAction);
  }

  authenticateByGoogle() {
    this._authService.authenticateByGoogle();
  }

  authenticateByFacebook() {}
}