import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  inject,
} from '@angular/core';
import { AuthService } from '@core/advanced-auth/services/common/auth.service';
import { AutoDestroyService } from '@core/advanced-auth/services/utils/auto-destroy.service';
import { AuthActionType } from '@core/advanced-auth/models/auth.interface';
import { GoogleIconComponent } from '@shared/advanced-auth/icons/google-icon.component';
import { FacebookBlueIconComponent } from '@shared/advanced-auth/icons/facebook-blue-icon.component';

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

  ngOnInit(): void {
    this._authService.initGoogleAuthConfig();
  }

  authenticateByGoogle() {
    this._authService.authenticateByGoogle();
  }

  authenticateByFacebook() {}
}
