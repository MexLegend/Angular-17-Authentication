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
  ILinkAccountData,
  ILinkAccountForm,
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

@Component({
  selector: 'app-link-account-page',
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
  templateUrl: './link-account-page.component.html',
  styleUrl: './link-account-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LinkAccountPageComponent implements OnDestroy {
  private readonly _fb = inject(NonNullableFormBuilder);
  private readonly _authService = inject(AuthService);
  private readonly _location = inject(Location);

  readonly $isLoading: Signal<boolean> = this._authService.$isLoadingAuth;

  form!: FormGroup<ILinkAccountForm>;
  formError?: IHttpError;

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
    this.form = this._fb.group<ILinkAccountForm>(
      {
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
  
  signIn() {
    this._authService.setAuthError(null);
    if (this.form.valid) {
      const loginData: ILinkAccountData = this.form.getRawValue();
      this._authService.signInWithEmailAndPassword(loginData).subscribe({
        next: () => {
          this._authService.authenticateUser();
        },
        error: (error: IHttpError) => {
          this._authService.setAuthError(error);
        },
      });
    }
  }

  navigateBack(){
    this._location.back();
  }
}
