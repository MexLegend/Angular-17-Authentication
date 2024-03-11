import {
  ChangeDetectionStrategy,
  Component,
  Signal,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from '@shared/firebase-auth/components/button/button.component';
import { AuthFormComponent } from '../../components/auth-form/auth-form.component';
import { ControlErrorsDirective } from '@core/firebase-auth/directives';
import { FormSubmitDirective } from '@core/firebase-auth/directives';
import { Location, NgClass } from '@angular/common';
import { AuthFormContainerComponent } from '../../components/auth-form-container/auth-form-container.component';
import { AuthService } from '@core/firebase-auth/services/common/auth.service';
import { DownArrowIconComponent } from '@shared/firebase-auth/icons/down-arrow-icon.component';
import { WebStorageService } from '@core/firebase-auth/services/utils/web-storage.service';
import { KEY_STORAGE } from '@core/firebase-auth/constants';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-verify-email-page',
  standalone: true,
  imports: [
    AuthFormContainerComponent,
    ButtonComponent,
    AuthFormComponent,
    DownArrowIconComponent,
    ReactiveFormsModule,
    ControlErrorsDirective,
    FormSubmitDirective,
    NgClass,
  ],
  templateUrl: './verify-email-page.component.html',
  styleUrl: './verify-email-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerifyEmailPageComponent {
  private readonly _authService = inject(AuthService);
  private readonly _webStorageService = inject(WebStorageService);
  private readonly _toastrService = inject(ToastrService);
  private readonly _location = inject(Location);

  readonly $isLoading: Signal<boolean> = this._authService.$isLoadingAuth;
  readonly $userEmail: WritableSignal<string | null> = signal(null);

  constructor() {
    this._webStorageService.useStorage('session');
    const userEmail = this._webStorageService.getItem<string>(
      KEY_STORAGE.DATA_USER_VERIFY_EMAIL
    );

    this.$userEmail.set(userEmail);
  }

  resendEmailVerification() {
    this._authService.sendEmailVerification().subscribe({
      next: () =>
        this._toastrService.success('Please check your email.', 'Link sent!'),
      error: (error) => this._authService.setAuthError(error),
    });
  }

  navigateBack() {
    this._location.back();
  }
}
