import { Directive, HostListener, input } from '@angular/core';

/**
 * A directive to restrict entered characters to match a given regex pattern
 * - `charRestrict` requires a regex pattern to match against
 * - Matches input characters through keydown and paste events
 *
 */
@Directive({
  selector: '[charRestrict]',
})
export class CharacterRestrictDirective {
  readonly charRestrict = input.required<RegExp>();

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.ctrlKey || event.metaKey || event.altKey) {
      return;
    }

    const char = event.key.toUpperCase();
    if (char.length !== 1) {
      return;
    }

    if (!this.charRestrict().test(char)) {
      event.preventDefault();
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    const clipboardData = event.clipboardData;
    const pasteText = clipboardData?.getData('text').toUpperCase() ?? '';

    if (!this.charRestrict().test(pasteText)) {
      event.preventDefault();
    }
  }
}
