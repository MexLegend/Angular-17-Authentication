import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FormValidators } from '@core/google-gapi/helpers';
import {
  IRegisterData,
  IRegisterForm,
} from '@core/google-gapi/models/auth.interface';
import { IAuthError } from '@core/google-gapi/models/error.interface';
import { AuthService } from '@core/google-gapi/services/common/auth.service';
import { AuthFormContainerComponent } from '../../components/auth-form-container/auth-form-container.component';
import { ButtonComponent } from '@shared/google-gapi/components/button/button.component';
import { AuthFormComponent } from '../../components/auth-form/auth-form.component';
import { ControlErrorsDirective } from '@core/google-gapi/directives';
import { FormSubmitDirective } from '@core/google-gapi/directives';

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
export class RegisterPageComponent {
  private readonly _fb = inject(NonNullableFormBuilder);
  private readonly _authService = inject(AuthService);

  form!: FormGroup<IRegisterForm>;
  formError?: IAuthError;

  constructor() {
    this.initForm();
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
    if (this.form.valid) {
      const registerData: IRegisterData = this.form.getRawValue();
      console.log(registerData);
    }
  }
}
