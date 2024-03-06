import { ValidatorFn, Validators } from '@angular/forms';
import { VALIDATOR_MESSAGE_DEFAULT } from '@core/google-gapi/constants/validator-messages.constant';

export class FormValidators {
  static required(message?: string): ValidatorFn {
    return (control) => {
      const error = Validators.required(control);
      return error ? { required: this._getMessage('required', message) } : null;
    };
  }

  static email(message?: string): ValidatorFn {
    return (control) => {
      const error = Validators.email(control);
      return error ? { email: this._getMessage('email', message) } : null;
    };
  }

  static passwordMismatch(message?: string): ValidatorFn {
    return (control) => {
      const error = Validators.email(control);
      return error
        ? { passwordMismatch: this._getMessage('passwordMismatch', message) }
        : null;
    };
  }

  static max(max: number, message?: string): ValidatorFn {
    return (control) => {
      const maxfunction = Validators.max(max);
      const error = maxfunction(control);

      return error
        ? { max: this._getMessage('max', message, [{ max: 12, current: 18 }]) }
        : null;
    };
  }

  private static _getMessage(
    control: keyof typeof VALIDATOR_MESSAGE_DEFAULT,
    message?: string,
    paramsMessage?: { [key: string]: unknown }[]
  ) {
    if (message) return message;

    let messageControl = VALIDATOR_MESSAGE_DEFAULT[control];
    const existParams = paramsMessage && paramsMessage.length > 0;

    if (existParams) {
      paramsMessage.forEach((params) => {
        Object.keys(params)
          .filter((key) => params[key])
          .forEach((key) => {
            messageControl = messageControl.replace(
              `\${${key}}`,
              params[key]!.toString()
            );
          });
      });

      return messageControl;
    }

    return messageControl;
  }
}
