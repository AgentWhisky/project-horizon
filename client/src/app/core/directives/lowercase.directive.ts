import { Directive, HostListener } from '@angular/core';

/**
 * A directive to force input characters to lowercase
 * -Example: `Hello World!` to `hello world!`
 */
@Directive({
  selector: '[lowercase]',
})
export class LowercaseDirective {
  @HostListener('input', ['$event'])
  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.toLowerCase();
  }
}
