import {
  ComponentRef,
  Directive,
  ElementRef,
  OnInit,
  ViewContainerRef,
  inject,
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { EMPTY, fromEvent, merge, takeUntil } from 'rxjs';
import { ControlErrorComponent } from '@shared/firebase-auth/components/control-error/control-error.component';
import { getFormControlError } from '@core/firebase-auth/helpers';
import { FormSubmitDirective } from './form-submit.directive';
import { AutoDestroyService } from '@core/firebase-auth/services/utils/auto-destroy.service';

@Directive({
  selector: '[formControl], [formControlName]',
  standalone: true,
  providers: [AutoDestroyService],
})
export class ControlErrorsDirective implements OnInit {
  private readonly _ngControl = inject(NgControl);
  private readonly _form = inject(FormSubmitDirective, { optional: true });
  private readonly _autoDestroyService = inject(AutoDestroyService);
  private readonly _elementRef: ElementRef<HTMLElement> = inject(ElementRef);
  private readonly _vcr = inject(ViewContainerRef);

  private _componentRef!: ComponentRef<ControlErrorComponent>;

  private readonly _submit$ = this._form ? this._form.submit$ : EMPTY;
  private readonly _blurEvent$ = fromEvent(
    this._elementRef.nativeElement,
    'blur'
  );

  ngOnInit(): void {
    merge(this._submit$, this._blurEvent$, this._ngControl.statusChanges!)
      .pipe(takeUntil(this._autoDestroyService))
      .subscribe(() => {
        const errorControl = getFormControlError(this._ngControl.control!);
        this.setError(errorControl);
      });
  }

  setError(text: string) {
    if (!this._componentRef) {
      this._componentRef = this._vcr.createComponent(ControlErrorComponent);
    }
    this._componentRef.instance.error = text;
  }
}
