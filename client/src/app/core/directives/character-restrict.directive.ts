import { Directive, HostListener, input, Input } from '@angular/core';

@Directive({
  selector: '[charRestrict]',
})
export class CharacterRestrictDirective {
  readonly charRestrictPattern = input.required<RegExp>();

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.ctrlKey || event.metaKey || event.altKey) {
      return;
    }

    const char = event.key.toUpperCase();
    if (char.length !== 1) {
      return;
    }

    if (!this.charRestrictPattern().test(char)) {
      event.preventDefault();
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    const clipboardData = event.clipboardData;
    const pasteText = clipboardData?.getData('text').toUpperCase() ?? '';

    if (!this.charRestrictPattern().test(pasteText)) {
      event.preventDefault();
    }
  }
}
