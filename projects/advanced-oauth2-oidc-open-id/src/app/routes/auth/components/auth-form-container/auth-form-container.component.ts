import { Component, Input, inject } from '@angular/core';
import { SocialAuthActionsComponent } from '../social-auth-actions/social-auth-actions.component';
import { AuthFormErrorComponent } from '../auth-form-error/auth-form-error.component';
import { AuthActionType } from '@core/advanced-auth/models/auth.interface';

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
}
