import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { ButtonComponent } from '@shared/advanced-auth/components/button/button.component';
import {
  ILoginData,
  ILoginForm,
} from '@core/advanced-auth/models/auth.interface';
import { AuthFormComponent } from '../../components/auth-form/auth-form.component';
import { FormValidators } from '@core/advanced-auth/helpers';
import { ControlErrorsDirective } from '@core/advanced-auth/directives';
import { FormSubmitDirective } from '@core/advanced-auth/directives';
import { RouterLink } from '@angular/router';
import { IAuthError } from '@core/advanced-auth/models/error.interface';
import { NgClass } from '@angular/common';
import { AuthFormContainerComponent } from '../../components/auth-form-container/auth-form-container.component';

@Component({
  selector: 'app-login-page',
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
  providers: [],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageComponent {
  private readonly _fb = inject(NonNullableFormBuilder);

  form!: FormGroup<ILoginForm>;
  formError?: IAuthError;

  constructor() {
    this.initForm();
  }

  initForm(): void {
    this.form = this._fb.group<ILoginForm>({
      email: this._fb.control('', {
        validators: [
          FormValidators.required('Enter the email'),
          FormValidators.email('Enter a valid email'),
        ],
      }),
      password: this._fb.control('', {
        validators: [FormValidators.required('Enter the password')],
      }),
    });
  }

  signIn() {
    if (this.form.valid) {
      const loginData: ILoginData = this.form.getRawValue();
      console.log(loginData);
    }
  }
}
