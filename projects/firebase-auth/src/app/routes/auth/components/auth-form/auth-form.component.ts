import {
  Component,
  Input,
  OnInit,
  WritableSignal,
  booleanAttribute,
  inject,
  signal,
} from '@angular/core';
import {
  ControlContainer,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { ControlErrorsDirective } from '@core/firebase-auth/directives';
import { EyeIconComponent } from '@shared/firebase-auth/icons/eye-icon.component';
import { EyeSlashIconComponent } from '@shared/firebase-auth/icons/eye-slash-icon.component';

@Component({
  selector: 'app-auth-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ControlErrorsDirective,
    EyeIconComponent,
    EyeSlashIconComponent,
  ],
  templateUrl: './auth-form.component.html',
  styleUrl: './auth-form.component.scss',
})
export class AuthFormComponent implements OnInit {
  @Input({ transform: booleanAttribute }) hideEmailInput: boolean = false;

  private readonly _parentContainer = inject(ControlContainer);
  formGroup!: FormGroup;
  readonly showPassword: WritableSignal<boolean> = signal(false);

  ngOnInit(): void {
    this.formGroup = this.parentFormGroup;
  }

  get parentFormGroup() {
    return this._parentContainer.control as FormGroup;
  }

  toogleShowPassword(event: MouseEvent) {
    event.stopPropagation();
    this.showPassword.update((value) => !value);
  }
}
