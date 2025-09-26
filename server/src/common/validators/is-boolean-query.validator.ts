import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

const TRUE_VALUES = new Set(['true', '1', 1, true]);
const FALSE_VALUES = new Set(['false', '0', 0, false]);

export function IsBooleanQuery(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'isBooleanQuery',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (value === undefined || value === null || value === '') {
            return true;
          }

          return TRUE_VALUES.has(value) || FALSE_VALUES.has(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a boolean value`;
        },
      },
    });
  };
}
