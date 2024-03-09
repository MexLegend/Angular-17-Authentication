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
  template: `@if (textError()) {
    <div class="static px-4 leading-5 tracking-wide text-left -m-[10px]">
      <span class="text-rose-500 text-xs">
        {{ textError() }}
      </span>
    </div>

    }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlErrorComponent {
  private readonly _changeDetectorRef = inject(ChangeDetectorRef);
  readonly textError: WritableSignal<string> = signal('');

  @Input() set error(value: string) {
    if (value !== this.textError()) {
      this.textError.set(value);
      this._changeDetectorRef.detectChanges();
    }
  }
}
