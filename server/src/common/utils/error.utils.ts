import { ValidationError } from 'class-validator';

/**
 * Get a formatted message containing the error name and message
 * @param error The given error
 * @returns A formatted error message
 */
export function getErrorNameAndMessage(error: unknown): string {
  if (error instanceof Error) {
    return `${error.constructor.name}: ${error.message}`;
  }
  return `NonError: ${String(error)}`;
}

/**
 * Get a flat validator error message array for a given array of validation errors
 * @param errors Validation errors
 * @returns An array of formatted error messages
 */
export function flattenValidationErrors(errors: ValidationError[]): string[] {
  const messages: string[] = [];

  const traverse = (errs: ValidationError[], parentPath = '') => {
    for (const err of errs) {
      const propertyPath = `${parentPath}/${err.property}`;

      if (err.constraints) {
        Object.values(err.constraints).forEach((errorMsg) => messages.push(`${propertyPath}: ${errorMsg}`));
      }

      if (err.children?.length) {
        traverse(err.children, propertyPath);
      }
    }
  };

  traverse(errors);

  return messages;
}
