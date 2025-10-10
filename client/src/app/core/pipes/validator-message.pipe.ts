import { Pipe, PipeTransform } from '@angular/core';
import { ValidationErrors } from '@angular/forms';

export interface ValidatorOptions {
  fieldName?: string;
  overrides?: Record<string, string>;
  default?: string;
}

export const validatorOpts = (options: ValidatorOptions) => options;

const DEFAULT_FIELD_NAME = 'This field';
const DEFAULT_ERROR_MESSAGES: Record<string, (value: any, fieldName: string) => string> = {
  pattern: (_value, fieldName) => `${fieldName} violates the set pattern`,
  unique: (_value, fieldName) => `${fieldName} is not unique`,
  minlength: (value, fieldName) => `${fieldName} minimum length required [${value.actualLength}/${value.requiredLength}]`,
  maxlength: (value, fieldName) => `${fieldName} maximum length exceeded [${value.actualLength}/${value.requiredLength}]`,
  min: (value, fieldName) => `${fieldName} minimum value required: ${value.min}`,
  max: (value, fieldName) => `${fieldName} maximum value exceeded: ${value.max}`,
  email: (_value, fieldName) => `${fieldName} is not a valid email address`,
  required: (_value, fieldName) => `${fieldName} is required`,
  unknown: (_value, fieldName) => `${fieldName} is invalid`,
};

/**
 * A pipe that transforms Angular form validation errors into user-friendly messages
 *
 * - `errors` is the validation errors array from a Form Control
 * - `overrides` is an optional map of custom error messages. Overrides can be used in place of existing default error messages or used to set messages for custom errors
 * - `default` can also be supplied for what to display if there are no errors
 *
 * - Example: `{{ linkForm.get('url')?.errors | validatorMessage : { pattern: 'Invalid URL format' } }}`
 */
@Pipe({
  name: 'validatorMessage',
})
export class ValidatorMessagePipe implements PipeTransform {
  transform(errors: ValidationErrors | null | undefined, options: ValidatorOptions = {}): string {
    const fieldName = options.fieldName || DEFAULT_FIELD_NAME;

    if (!errors) {
      return options.default || '';
    }

    const overrides = options.overrides || {};

    for (const [key, value] of Object.entries(errors)) {
      if (overrides[key]) {
        return overrides[key];
      }

      const messageFn = DEFAULT_ERROR_MESSAGES[key];
      if (messageFn) {
        return messageFn(value, fieldName);
      }

      console.warn('Unhandled validation error:', key, value);
    }
    return DEFAULT_ERROR_MESSAGES['unknown'](null, fieldName);
  }
}
