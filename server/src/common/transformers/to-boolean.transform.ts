import { TransformFnParams } from 'class-transformer';

const TRUE_VALUES = new Set(['true', '1', 1, true]);
const FALSE_VALUES = new Set(['false', '0', 0, false]);

export function ToBoolean() {
  return ({ value }: TransformFnParams): boolean | undefined => {
    if (value === undefined || value === null || value === '') {
      return undefined;
    }
    
    if (TRUE_VALUES.has(value)) {
      return true;
    }

    if (FALSE_VALUES.has(value)) {
      return false;
    }

    return value;
  };
}
