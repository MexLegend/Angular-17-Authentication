import { Component, Input } from '@angular/core';
import { IHttpError } from '@core/firebase-auth/models/http-error.interface';
import { ErrorIconComponent } from '@shared/firebase-auth/icons/error-icon.component';

@Component({
  selector: 'app-http-error',
  standalone: true,
  imports: [ErrorIconComponent],
  template: `
    <section
      class="flex items-start font-medium justify-start w-full gap-3 border border-rose-500 bg-rose-50 text-rose-500 rounded-xl py-3 px-4"
    >
      <app-error-icon [size]="30" />
      <p class="text-sm my-auto">{{ error.message }}</p>
    </section>
  `,
})
export class HttpErrorComponent {
  @Input({ required: true }) error!: IHttpError;
}
