import { Pipe, PipeTransform } from '@angular/core';
import { ValidationErrors } from '@angular/forms';

const DEFAULT_ERROR_MESSAGES: Record<string, (value?: any) => string> = {
  required: () => 'This field is required',
  pattern: () => 'This field violates the set pattern',
  unique: () => 'This field is not unique',
  minlength: (value) => `Minimum length required [${value.actualLength}/${value.requiredLength}]`,
  maxlength: (value) => `Maximum length exceeded [${value.actualLength}/${value.requiredLength}]`,
  min: (value) => `Minimum value required: ${value.min}`,
  max: (value) => `Maximum value exceeded: ${value.max}`,
  unknown: () => 'This field is invalid',
};

@Pipe({
  name: 'validatorMessage',
})
export class ValidatorMessagePipe implements PipeTransform {
  /**
   * Transforms Angular form validation errors into user-friendly messages.
   *
   * @param errors - The ValidationErrors errors array from a Form Control.
   * @param overrides - Optional map of custom error messages.
   *   Overides can be used in place of existing default error messages or used to set custom error messages
   *   You can also add a 'default' key for what to display if there are no errors
   *
   * Example:
   *   {{ linkForm.get('url')?.errors | validatorMessage : { pattern: 'Invalid URL format' } }}
   */
  transform(errors: ValidationErrors | null | undefined, overrides: Record<string, string> = {}): string {
    if (!errors) {
      return overrides['default'] || '';
    }

    for (const [key, value] of Object.entries(errors)) {
      if (overrides[key]) {
        return overrides[key];
      }

      const messageFn = DEFAULT_ERROR_MESSAGES[key];
      if (messageFn) {
        return messageFn(value);
      }

      console.warn('Unhandled validation error:', key, value);
    }
    return DEFAULT_ERROR_MESSAGES['unknown']();
  }
}
