import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validator to check if the control matches a given password field
 * @param fieldName is the name of the password control
 * @returns a validator function for a password match
 */
export function passwordMatch(fieldName: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value || typeof control.value !== 'string') {
      return null;
    }

    const password = control.parent?.get(fieldName)?.value;
    const confirmPassword = control?.value;

    console.log(password, confirmPassword);
    
    return password === confirmPassword ? null : { passwordMatch: { value: control.value } };
  };
}
