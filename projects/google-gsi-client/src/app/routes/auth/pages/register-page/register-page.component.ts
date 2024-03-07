import { NgClass } from '@angular/common';
import { Component, OnDestroy, Signal, effect, inject, untracked } from '@angular/core';
import {
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FormValidators } from '@core/google-gsi-client/helpers';
import {
  IRegisterData,
  IRegisterForm,
} from '@core/google-gsi-client/models/auth.interface';
import { IAuthError } from '@core/google-gsi-client/models/error.interface';
import { AuthService } from '@core/google-gsi-client/services/common/auth.service';
import { AuthFormContainerComponent } from '../../components/auth-form-container/auth-form-container.component';
import { ButtonComponent } from '@shared/google-gsi-client/components/button/button.component';
import { AuthFormComponent } from '../../components/auth-form/auth-form.component';
import { ControlErrorsDirective } from '@core/google-gsi-client/directives';
import { FormSubmitDirective } from '@core/google-gsi-client/directives';

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

  readonly $isLoading: Signal<boolean> = this._authService.$isLoadingAuth;

  form!: FormGroup<IRegisterForm>;
  formError?: IAuthError;

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
    this.form = this._fb.group<IRegisterForm>({
      name: this._fb.control('', {
        validators: [FormValidators.required('Enter the name')],
      }),
      phone: this._fb.control(''),
      email: this._fb.control('', {
        validators: [
          FormValidators.required('Enter the email'),
          FormValidators.email(),
        ],
      }),
      password: this._fb.control('', {
        validators: [FormValidators.required('Enter the password')],
      }),
      repeatPassword: this._fb.control('', {
        validators: [
          FormValidators.required('Enter the password'),
          FormValidators.passwordMismatch(),
        ],
      }),
    });
  }

  signUp() {
    this._authService.setAuthError(null);
    if (this.form.valid) {
      const registerData: IRegisterData = this.form.getRawValue();
      console.log(registerData);
    }
  }
}
