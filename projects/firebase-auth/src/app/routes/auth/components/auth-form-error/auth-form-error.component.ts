import { Component, Input } from '@angular/core';
import { IAuthError } from '@core/google-gsi-client/models/error.interface';
import { ErrorIconComponent } from '@shared/google-gsi-client/icons/error-icon.component';

@Component({
  selector: 'app-auth-form-error',
  standalone: true,
  imports: [ErrorIconComponent],
  template: `
    <section
      class="flex items-start justify-start w-full gap-3 border border-rose-500 bg-rose-50 text-rose-500 rounded-xl py-3 px-4"
    >
      <app-error-icon [size]="30" />
      <p class="text-sm my-auto">{{ error.message }}</p>
    </section>
  `,
})
export class AuthFormErrorComponent {
  @Input({ required: true }) error!: IAuthError;
}
