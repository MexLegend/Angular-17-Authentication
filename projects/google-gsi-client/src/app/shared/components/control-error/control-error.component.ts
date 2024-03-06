import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';

@Component({
  selector: 'app-control-error',
  standalone: true,
  imports: [],
  template: `@if (textError()) {
    <div class="form-field-error">
      <span class="error-message">
        {{ textError() }}
      </span>
    </div>

    }`,
  styleUrl: './control-error.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlErrorComponent {
  readonly textError: WritableSignal<string> = signal('');

  @Input() set error(value: string) {
    if (value !== this.textError()) {
      this.textError.set(value);
      this._cdr.detectChanges();
    }
  }

  private _cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
}
