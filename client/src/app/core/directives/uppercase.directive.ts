import { Directive, HostListener } from '@angular/core';

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
