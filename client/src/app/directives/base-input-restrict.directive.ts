import { Directive, ElementRef, HostListener, Input, input } from '@angular/core';

@Directive({
  selector: '[baseInputRestrict]',
})
export class BaseInputRestrictDirective {
  readonly base = input<number>(10);

  private baseCharMap: Record<number, RegExp> = {
    2: /^[01]$/,
    3: /^[0-2]$/,
    4: /^[0-3]$/,
    5: /^[0-4]$/,
    6: /^[0-5]$/,
    7: /^[0-6]$/,
    8: /^[0-7]$/,
    9: /^[0-8]$/,
    10: /^[0-9]$/,
    11: /^[0-9A]$/,
    12: /^[0-9A-B]$/,
    16: /^[0-9A-F]$/,
    20: /^[0-9A-J]$/,
    26: /^[A-Z]$/,
    32: /^[0-9A-V]$/,
    36: /^[0-9A-Z]$/,
  };

  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event']) onInput(event: Event) {
    const inputElement = event.target as HTMLInputElement | HTMLTextAreaElement;
    const regex = this.baseCharMap[this.base()] || /^[0-9]$/;

    // Filter out invalid characters
    const filteredValue = inputElement.value
      .toUpperCase()
      .split('')
      .filter((char) => regex.test(char))
      .join('');

    // Only update the input if the value actually changed
    if (inputElement.value !== filteredValue) {
      inputElement.value = filteredValue;
    }
  }

  @HostListener('paste', ['$event']) onPaste(event: ClipboardEvent) {
    event.preventDefault(); // Prevent pasting invalid characters

    const clipboardData = event.clipboardData?.getData('text') || '';
    const regex = this.baseCharMap[this.base()] || /^[0-9]$/;

    // Filter and insert only valid characters
    const validText = clipboardData
      .toUpperCase()
      .split('')
      .filter((char) => regex.test(char))
      .join('');
    document.execCommand('insertText', false, validText);
  }
}
