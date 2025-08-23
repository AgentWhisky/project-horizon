import { Directive, HostListener } from '@angular/core';

/**
 * A directive to force input characters to uppercase
 * -Example: `Hello World!` to `HELLO WORLD!`
 */
@Directive({
  selector: '[uppercase]',
})
export class UppercaseDirective {
  @HostListener('input', ['$event'])
  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.toUpperCase();
  }
}
