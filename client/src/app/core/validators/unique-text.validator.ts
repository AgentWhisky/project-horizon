import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validator to check if the control exists in a given string array
 * @param textArray the given string array
 * @returns a validator function for a unique string
 */
export function uniqueText(textArray: string[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value || typeof control.value !== 'string') {
      return null;
    }

    const normalizedInput = control.value.trim().toLowerCase();
    const isUnique = textArray.some((text) => text.toLowerCase() === normalizedInput);
    return isUnique ? { unique: { value: control.value } } : null;
  };
}
