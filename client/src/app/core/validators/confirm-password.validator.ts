import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validator to check if the control matches a given password field
 * @param fieldName is the name of the password control
 * @returns a validator function for a password match
 */
export const confirmPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  return control.value.password === control.value.confirmPassword ? null : { passwordNoMatch: true };
};
