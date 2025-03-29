import { Pipe, PipeTransform } from '@angular/core';
import { ValidationErrors } from '@angular/forms';

const ERROR_MESSAGES: Record<string, string> = {
  unknown: 'This field is invalid',
  required: 'This field is required',
  pattern: 'This field violates the pattern',
  unique: 'This field is not unique',
};

@Pipe({
  name: 'validatorMessage',
})
export class ValidatorMessagePipe implements PipeTransform {
  transform(errors: ValidationErrors | null | undefined, overrides: Record<string, string> = {}): string {
    // Display empty if no errors
    if (!errors) {
      // Display default validator message if set
      if (overrides['default']) {
        return overrides['default'];
      }

      return '';
    }

    for (const [key, value] of Object.entries(errors)) {
      // Attempt Overrides
      if (overrides[key]) {
        return overrides[key];
      }

      // Preset Messages
      if (ERROR_MESSAGES[key]) {
        return ERROR_MESSAGES[key];
      }

      // Check In Length
      if (key === 'minlength') {
        return `Min length required [${value.actualLength}/${value.requiredLength}]`;
      }

      // Check Max Length
      if (key === 'maxlength') {
        return `Max length exceeded [${value.actualLength}/${value.requiredLength}]`;
      }

      console.log('Unhandeld Error Message', `${key}:${value}`);
    }
    return ERROR_MESSAGES['unknown'];
  }
}
