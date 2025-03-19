import { Directive, HostListener, input } from '@angular/core';

@Directive({
  selector: '[appBaseInput]',
})
export class BaseInputDirective {
  private basePatterns: { [key: number]: RegExp } = {
    2: /^[01]+$/, // Binary (0-1)
    8: /^[0-7]+$/, // Octal (0-7)
    10: /^[0-9]+$/, // Decimal (0-9)
    16: /^[0-9a-fA-F]+$/, // Hexadecimal (0-9, A-F)
  };

}
