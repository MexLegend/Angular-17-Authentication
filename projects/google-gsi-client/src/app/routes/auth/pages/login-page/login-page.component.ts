import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  effect,
  inject,
  untracked,
} from '@angular/core';
import {
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { ButtonComponent } from '@shared/google-gsi-client/components/button/button.component';
import {
  ILoginData,
  ILoginForm,
} from '@core/google-gsi-client/models/auth.interface';
import { AuthFormComponent } from '../../components/auth-form/auth-form.component';
import { FormValidators } from '@core/google-gsi-client/helpers';
import { ControlErrorsDirective } from '@core/google-gsi-client/directives';
import { FormSubmitDirective } from '@core/google-gsi-client/directives';
import { RouterLink } from '@angular/router';
import { IAuthError } from '@core/google-gsi-client/models/error.interface';
import { NgClass } from '@angular/common';
import { AuthFormContainerComponent } from '../../components/auth-form-container/auth-form-container.component';
import { AuthService } from '@core/google-gsi-client/services/common/auth.service';

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
export class LoginPageComponent implements OnDestroy {
  private readonly _fb = inject(NonNullableFormBuilder);
  private readonly _authService = inject(AuthService);
  readonly $isLoading = this._authService.isLoading();

  form!: FormGroup<ILoginForm>;
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
    this._authService.stopIsLoading();
    this._authService.setAuthError(null);
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
    this._authService.setAuthError(null);
    if (this.form.valid) {
      const loginData: ILoginData = this.form.getRawValue();
      console.log(loginData);
    }
  }
}
