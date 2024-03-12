import {
  ComponentRef,
  DestroyRef,
  Directive,
  ElementRef,
  OnInit,
  ViewContainerRef,
  inject,
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { EMPTY, fromEvent, map, merge } from 'rxjs';
import { ControlErrorComponent } from '@shared/firebase-auth/components/control-error/control-error.component';
import { getFormControlError } from '@core/firebase-auth/helpers';
import { FormSubmitDirective } from './form-submit.directive';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Directive({
  selector: '[formControl], [formControlName]',
  standalone: true,
})
export class ControlErrorsDirective implements OnInit {
  private readonly _ngControl = inject(NgControl);
  private readonly _form = inject(FormSubmitDirective, { optional: true });
  private readonly _elementRef: ElementRef<HTMLElement> = inject(ElementRef);
  private readonly _vcr = inject(ViewContainerRef);
  private readonly _destroyRef = inject(DestroyRef);

  private _componentRef!: ComponentRef<ControlErrorComponent>;

  private readonly _submit$ = this._form ? this._form.submit$ : EMPTY;
  private readonly _blurEvent$ = fromEvent(
    this._elementRef.nativeElement,
    'blur'
  );

  ngOnInit(): void {
    merge(
      this._submit$.pipe(map(() => 'submit')),
      this._blurEvent$.pipe(map(() => 'blur')),
      this._ngControl.statusChanges!.pipe(map(() => 'status'))
    )
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((eventType) => {
        const errorControl = getFormControlError(this._ngControl.control!);
        this.setError(errorControl);

        if (eventType === 'submit' && errorControl) {
          this.setFocusOnFirstInvalidControl();
        }
      });
  }

  setError(text: string) {
    if (!this._componentRef) {
      this._componentRef = this._vcr.createComponent(ControlErrorComponent);
    }
    this._componentRef.instance.error = text;
  }

  setFocusOnFirstInvalidControl() {
    const invalidControl =
      this._form?.element.querySelector('input.ng-invalid');

    if (invalidControl && document.activeElement !== invalidControl) {
      (invalidControl as HTMLElement).focus();
    }
  }
}
