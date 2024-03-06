import { Component, Input } from '@angular/core';
import { IAuthError } from '@core/google-auth2-gapi/models/error.interface';
import { ErrorIconComponent } from '@shared/google-auth2-gapi/icons/error-icon.component';

@Component({
  selector: 'app-auth-form-error',
  standalone: true,
  imports: [ErrorIconComponent],
  templateUrl: './auth-form-error.component.html',
  styleUrl: './auth-form-error.component.scss',
})
export class AuthFormErrorComponent {
  @Input({ required: true }) error!: IAuthError;
}