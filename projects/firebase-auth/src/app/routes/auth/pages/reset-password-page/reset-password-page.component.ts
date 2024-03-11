import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  Signal,
  WritableSignal,
  computed,
  effect,
  inject,
  signal,
  untracked,
} from '@angular/core';
import {
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { ButtonComponent } from '@shared/firebase-auth/components/button/button.component';
import {
  IResetPasswordData,
  IResetPasswordForm,
} from '@core/firebase-auth/models/auth.interface';
import { AuthFormComponent } from '../../components/auth-form/auth-form.component';
import { FormValidators } from '@core/firebase-auth/helpers';
import { ControlErrorsDirective } from '@core/firebase-auth/directives';
import { FormSubmitDirective } from '@core/firebase-auth/directives';
import { RouterLink } from '@angular/router';
import { IHttpError } from '@core/firebase-auth/models/http-error.interface';
import { Location, NgClass } from '@angular/common';
import { AuthFormContainerComponent } from '../../components/auth-form-container/auth-form-container.component';
import { AuthService } from '@core/firebase-auth/services/common/auth.service';
import { DownArrowIconComponent } from '@shared/firebase-auth/icons/down-arrow-icon.component';
import { WebStorageService } from '@core/firebase-auth/services/utils/web-storage.service';
import { KEY_STORAGE } from '@core/firebase-auth/constants';
import { IFirebaseErrorCustomData } from '@core/firebase-auth/models';

@Component({
  selector: 'app-reset-password-page',
  standalone: true,
  imports: [
    AuthFormContainerComponent,
    ButtonComponent,
    AuthFormComponent,
    DownArrowIconComponent,
    ReactiveFormsModule,
    ControlErrorsDirective,
    FormSubmitDirective,
    RouterLink,
    NgClass,
  ],
  templateUrl: './reset-password-page.component.html',
  styleUrl: './reset-password-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPasswordPageComponent implements OnDestroy {
  private readonly _fb = inject(NonNullableFormBuilder);
  private readonly _authService = inject(AuthService);
  private readonly _webStorageService = inject(WebStorageService);
  private readonly _location = inject(Location);

  readonly $isLoading: Signal<boolean> = this._authService.$isLoadingAuth;
  readonly $userCredential: WritableSignal<IFirebaseErrorCustomData | null> =
    signal(null);
  readonly $providerName: Signal<string> = computed(
    () => this.$userCredential()?.providerId.split('.')[0] || ''
  );

  form!: FormGroup<IResetPasswordForm>;
  formError?: IHttpError;

  constructor() {
    this.initForm();
    this._webStorageService.useStorage('session');
    const userCredential =
      this._webStorageService.getItem<IFirebaseErrorCustomData>(
        KEY_STORAGE.DATA_USER_CREDENTIAL
      );

    if (!userCredential) {
      this.navigateBack();
      return;
    }

    this.$userCredential.set(userCredential);

    effect(() => {
      this.$isLoading()
        ? untracked(() => {
            this.form.disable();
          })
        : untracked(() => {
            this.form.enable({ emitEvent: false });
          });
    });
  }

  ngOnDestroy(): void {
    this._authService.setIsLoading(false);
    this._authService.setAuthError(null);
  }

  initForm(): void {
    this.form = this._fb.group<IResetPasswordForm>({
      email: this._fb.control('', {
        validators: [
          FormValidators.required('Enter the email'),
          FormValidators.email(),
        ],
      }),
    });
  }

  resetPassword(formRef: HTMLFormElement) {
    this._authService.setAuthError(null);
    if (this.form.valid) {
      const { email }: IResetPasswordData = this.form.getRawValue();

      this._authService.sendPasswordResetEmail(email).subscribe({
        error: (error: IHttpError) => {
          this.form.reset(undefined, { emitEvent: false });
          const firstInput = formRef.querySelector('input') as HTMLElement;
          firstInput.focus();
          this._authService.setAuthError(error);
        },
      });
    }
  }

  navigateBack() {
    this._location.back();
  }
}
