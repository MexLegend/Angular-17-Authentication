import { NgClass } from '@angular/common';
import {
  Component,
  OnDestroy,
  Signal,
  effect,
  inject,
  untracked,
} from '@angular/core';
import {
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FormValidators } from '@core/firebase-auth/helpers';
import { IRegisterData, IRegisterForm } from '@core/firebase-auth/models';
import { IHttpError } from '@core/firebase-auth/models';
import { AuthService } from '@core/firebase-auth/services/common/auth.service';
import { AuthFormContainerComponent } from '../../components/auth-form-container/auth-form-container.component';
import { ButtonComponent } from '@shared/firebase-auth/components/button/button.component';
import { AuthFormComponent } from '../../components/auth-form/auth-form.component';
import { ControlErrorsDirective } from '@core/firebase-auth/directives';
import { FormSubmitDirective } from '@core/firebase-auth/directives';
import { WebStorageService } from '@core/firebase-auth/services/utils/web-storage.service';
import { KEY_STORAGE } from '@core/firebase-auth/constants';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [
    AuthFormContainerComponent,
    ButtonComponent,
    AuthFormComponent,
    ReactiveFormsModule,
    ControlErrorsDirective,
    FormSubmitDirective,
    RouterLink,
    NgClass,
  ],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss',
})
export class RegisterPageComponent implements OnDestroy {
  private readonly _fb = inject(NonNullableFormBuilder);
  private readonly _authService = inject(AuthService);
  private readonly _webStorageService = inject(WebStorageService);
  private readonly _router = inject(Router);

  readonly $isLoading: Signal<boolean> = this._authService.$isLoadingAuth;

  form!: FormGroup<IRegisterForm>;

  constructor() {
    this.initForm();

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
    this.form = this._fb.group<IRegisterForm>(
      {
        name: this._fb.control('', {
          validators: [FormValidators.required('Enter the name')],
        }),
        phoneNumber: this._fb.control(''),
        email: this._fb.control('', {
          validators: [
            FormValidators.required('Enter the email'),
            FormValidators.email(),
          ],
        }),
        password: this._fb.control('', {
          validators: [FormValidators.required('Enter the password')],
        }),
        confirmPassword: this._fb.control('', {
          validators: [FormValidators.required('Confirm the password')],
        }),
      },
      {
        validators: FormValidators.passwordMismatch(),
      }
    );
  }

  signUp(formRef: HTMLFormElement) {
    this._authService.setAuthError(null);
    if (this.form.valid) {
      const registerData: IRegisterData = this.form.getRawValue();
      this._authService.signUpWithEmailAndPassword(registerData).subscribe({
        next: () => {
          this._webStorageService.useStorage('session');
          this._webStorageService.setItem(
            KEY_STORAGE.DATA_USER_VERIFY_EMAIL,
            registerData.email
          );

          this._router.navigate(['/auth/verify-email']);
        },
        error: (error: IHttpError) => {
          this.form.reset(
            {
              ...registerData,
              password: '',
              confirmPassword: '',
            },
            { emitEvent: false }
          );
          const passwordInput = formRef.querySelector('input[formcontrolname="password"]') as HTMLElement;
          console.log(passwordInput);
          
          passwordInput.focus();
          this._authService.setAuthError(error);
        },
      });
    }
  }
}
