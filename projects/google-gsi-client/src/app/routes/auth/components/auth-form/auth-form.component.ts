import { Component, OnInit, inject } from '@angular/core';
import {
  ControlContainer,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { ControlErrorsDirective } from '@core/google-gsi-client/directives';

@Component({
  selector: 'app-auth-form',
  standalone: true,
  imports: [ReactiveFormsModule, ControlErrorsDirective],
  templateUrl: './auth-form.component.html',
  styleUrl: './auth-form.component.scss',
})
export class AuthFormComponent implements OnInit {
  private readonly _parentContainer = inject(ControlContainer);
  formGroup!: FormGroup;

  ngOnInit(): void {
    this.formGroup = this.parentFormGroup;
  }

  get parentFormGroup() {
    return this._parentContainer.control as FormGroup;
  }
}
