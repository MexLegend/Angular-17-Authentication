import {
  ChangeDetectionStrategy,
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
import { ButtonComponent } from '@shared/firebase-auth/components/button/button.component';
import {
  ILoginData,
  ILoginForm,
} from '@core/firebase-auth/models/auth.interface';
import { AuthFormComponent } from '../../components/auth-form/auth-form.component';
import { FormValidators } from '@core/firebase-auth/helpers';
import { ControlErrorsDirective } from '@core/firebase-auth/directives';
import { FormSubmitDirective } from '@core/firebase-auth/directives';
import { Router, RouterLink } from '@angular/router';
import { IHttpError } from '@core/firebase-auth/models/http-error.interface';
import { NgClass } from '@angular/common';
import { AuthFormContainerComponent } from '../../components/auth-form-container/auth-form-container.component';
import { AuthService } from '@core/firebase-auth/services/common/auth.service';
import { WebStorageService } from '@core/firebase-auth/services/utils/web-storage.service';
import { KEY_STORAGE } from '@core/firebase-auth/constants';

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
  private readonly _webStorageService = inject(WebStorageService);
  private readonly _router = inject(Router);

  readonly $isLoading: Signal<boolean> = this._authService.$isLoadingAuth;
  $formError: Signal<IHttpError | null> = this._authService.$authError;

  form!: FormGroup<ILoginForm>;

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

  signIn(formRef: HTMLFormElement) {
    this._authService.setAuthError(null);
    if (this.form.valid) {
      const loginData: ILoginData = this.form.getRawValue();
      this._authService.signInWithEmailAndPassword(loginData).subscribe({
        next: ({ user }) => {
          if (!user.emailVerified) {
            this._webStorageService.useStorage('session');
            this._webStorageService.setItem(
              KEY_STORAGE.DATA_USER_VERIFY_EMAIL,
              user.email
            );
            this._router.navigate(['/auth/verify-email']);
            return;
          }
          this._authService.authenticateUser();
        },
        error: (error: IHttpError) => {
          this.form.controls.password.reset(undefined, { emitEvent: false });
          const passwordInput = formRef.querySelector('input[formcontrolname="password"]') as HTMLElement;
          passwordInput.focus();
          this._authService.setAuthError(error);
        },
      });
    }
  }
}
