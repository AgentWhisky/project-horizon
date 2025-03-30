import { Directive, HostListener } from '@angular/core';

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
