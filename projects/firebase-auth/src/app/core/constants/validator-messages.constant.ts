import { ValidationErrors } from '@angular/forms';

export const VALIDATOR_MESSAGE_DEFAULT: ValidationErrors = {
    required: 'This field is required',
    email: 'Enter a valid email',
    minlength: 'Password must be at least {0} characters long',
    maxlength: 'Password cannot exceed {0} characters',
    pattern: 'Password must include at least one letter and one number',
    passwordMismatch: 'Passwords do not match'
  };