import { computed, inject, Injectable, signal } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import katex from 'katex';

import { MatSnackBar } from '@angular/material/snack-bar';

import { SNACKBAR_INTERVAL } from '@hz/core/constants';

@Injectable({
  providedIn: 'root',
})
export class LatexEditorService {
  private sanitizer = inject(DomSanitizer);
  private snackbar = inject(MatSnackBar);

  readonly textInput = signal<string>('');
  readonly renderSize = signal<number>(20);

  readonly renderedLatex = computed(() =>
    // Register rendered LaTex HTML as safe
    this.sanitizer.bypassSecurityTrustHtml(katex.renderToString(this.textInput(), { throwOnError: false }))
  );

  resetTextInput() {
    try {
      this.textInput.set('');
      this.snackbar.open(`Successfully cleared text input`, 'Close', { duration: SNACKBAR_INTERVAL.NORMAL });
    } catch (error) {
      this.snackbar.open(`Failed to clear text input`, 'Close', { duration: SNACKBAR_INTERVAL.NORMAL });
    }
  }

  insertAtCursor(textArea: HTMLTextAreaElement, text: string) {
    if (!textArea) {
      return;
    }

    const start = textArea.selectionStart ?? 0;
    const end = textArea.selectionEnd ?? 0;

    textArea.setRangeText(text, start, end, 'end');
    textArea.focus();
  }

  copyTextInput() {
    navigator.clipboard
      .writeText(this.textInput())
      .then(() => {
        this.snackbar.open(`Successfully copied to clipboard`, 'Close', { duration: SNACKBAR_INTERVAL.NORMAL });
      })
      .catch(() => {
        this.snackbar.open(`Failed to copy to clipboard`, 'Close', { duration: SNACKBAR_INTERVAL.NORMAL });
      });
  }
}
