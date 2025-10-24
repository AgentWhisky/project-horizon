import { computed, effect, inject, Injectable, signal } from '@angular/core';

import { MatSnackBar } from '@angular/material/snack-bar';

import { SNACKBAR_INTERVAL } from '@hz/core/constants';
import { LatexCommand } from './resources/latex-editor.model';
import { LATEX_MENU, MAX_COMMAND_HISTORY } from './resources/latex-editor.constants';
import { HzCommand } from '@hz/shared/components';

@Injectable({
  providedIn: 'root',
})
export class LatexEditorService {
  private snackbar = inject(MatSnackBar);

  readonly textInput = signal<string>('');

  private readonly _commandHistory = signal<LatexCommand[]>([]);
  readonly sortedCommandHistory = computed(() => [...this._commandHistory()].sort((a, b) => a.id - b.id));

  readonly renderSize = signal<number>(20);

  readonly commandPaletteCMDs: HzCommand[];
  readonly commandLookup = new Map<number, LatexCommand>();

  constructor() {
    this.commandPaletteCMDs = LATEX_MENU.flatMap((section) =>
      section.commands.map((command) => {
        this.commandLookup.set(command.id, command);

        return {
          id: command.id,
          label: command.label,
          value: command.value,
          latex: command.value,
        };
      })
    );
  }

  resetTextInput() {
    this.textInput.set('');
  }

  insertAtCursor(textArea: HTMLTextAreaElement, command: LatexCommand) {
    if (!textArea) {
      return;
    }

    const start = textArea.selectionStart ?? 0;
    const end = textArea.selectionEnd ?? 0;

    const startText = textArea.value.slice(0, start);
    const endText = textArea.value.slice(end);

    const newText = startText + command.value + endText;

    this.textInput.set(newText);
    textArea.focus();

    this.updateCommandHistory(command);
  }

  copyExpression() {
    navigator.clipboard
      .writeText(this.textInput())
      .then(() => {
        this.snackbar.open(`Successfully copied to clipboard`, 'Close', { duration: SNACKBAR_INTERVAL.NORMAL });
      })
      .catch(() => {
        this.snackbar.open(`Failed to copy to clipboard`, 'Close', { duration: SNACKBAR_INTERVAL.NORMAL });
      });
  }

  private updateCommandHistory(command: LatexCommand) {
    const currentCommandHistory = this._commandHistory();

    const filteredHistory = currentCommandHistory.filter((c) => c.id !== command.id);
    filteredHistory.push(command);

    if (filteredHistory.length > MAX_COMMAND_HISTORY) {
      filteredHistory.shift();
    }

    this._commandHistory.set(filteredHistory);
  }
}
