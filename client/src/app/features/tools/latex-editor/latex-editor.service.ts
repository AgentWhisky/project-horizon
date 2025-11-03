import { computed, inject, Injectable, signal } from '@angular/core';

import { MatSnackBar } from '@angular/material/snack-bar';

import { DEBOUNCE_TIME, SNACKBAR_INTERVAL, STORAGE_KEYS } from '@hz/core/constants';
import { LatexCommand, LatexSection, SavedCurrentExpression, SavedExpression } from './resources/latex-editor.model';
import { LATEX_COMMANDS, MAX_COMMAND_HISTORY } from './resources/latex-editor.constants';
import { FormBuilder, FormControl } from '@angular/forms';
import { debounceTime, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LatexEditorService {
  private fb = inject(FormBuilder);
  private snackbar = inject(MatSnackBar);

  private readonly _commandHistory = signal<LatexCommand[]>([]);
  readonly sortedCommandHistory = computed(() => [...this._commandHistory()].sort((a, b) => a.id - b.id));

  private readonly _savedExpressions = signal<SavedExpression[]>(this.loadExpressions());
  readonly savedExpressions = this._savedExpressions.asReadonly();

  readonly commandFilter = signal<string>('');
  readonly renderSize = signal<number>(20);
  readonly latexCommandSections = signal<LatexSection[]>(LATEX_COMMANDS);
  readonly filteredLatexCommands = computed(() => this.filterCommandSection(this.commandFilter()));

  readonly latexEditorForm;

  constructor() {
    const { expression, isDirty, isTouched } = this.loadCurrentExpression();

    this.latexEditorForm = this.fb.group({
      latex: this.fb.control(expression, { nonNullable: true }),
    });

    if (isTouched) {
      this.latexEditorForm.markAsTouched();
    }

    if (isDirty) {
      this.latexEditorForm.markAsDirty();
    }

    // Save latex editor form value on normal debounce time
    this.latexEditorForm
      .get('latex')!
      .valueChanges.pipe(
        debounceTime(DEBOUNCE_TIME.NORMAL),
        tap((latex: string) => this.saveCurrentExpression(latex, true, true))
      )
      .subscribe();
  }

  resetTextInput() {
    // Reset the form and save expression immediatly, bypassing value changes debounce
    this.latexEditorForm.reset({ latex: '' }, { emitEvent: false });
    this.saveCurrentExpression('', false, false);
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

    this.latexEditorForm.patchValue({ latex: newText }, { emitEvent: false });
    this.latexEditorForm.markAsDirty();
    this.latexEditorForm.markAsTouched();
    this.saveCurrentExpression(newText, true, true);

    // Restore cursor back to end of inserted command text
    requestAnimationFrame(() => {
      textArea.focus();
      const cursorPos = start + command.value.length;
      textArea.setSelectionRange(cursorPos, cursorPos);
    });

    this.updateCommandHistory(command);
  }

  copyExpression(expression?: string) {
    // Pull current form value if no expression given
    if (!expression) {
      expression = this.latexEditorForm.controls.latex.value ?? '';
    }

    navigator.clipboard
      .writeText(expression)
      .then(() => {
        this.snackbar.open(`Successfully copied to clipboard`, 'Close', { duration: SNACKBAR_INTERVAL.NORMAL });
      })
      .catch(() => {
        this.snackbar.open(`Failed to copy to clipboard`, 'Close', { duration: SNACKBAR_INTERVAL.NORMAL });
      });
  }

  saveExpression(name: string) {
    const currentSaved = this._savedExpressions();
    const expression = this.latexEditorForm.controls.latex.value ?? '';

    const newSaved: SavedExpression = {
      id: Math.max(...currentSaved.map((e) => e.id), 0) + 1,
      name,
      expression: expression,
    };

    const newExpressions = [newSaved, ...currentSaved];

    this._savedExpressions.set(newExpressions);
    this.saveExpressions(newExpressions);

    this.latexEditorForm.markAsPristine();
    this.latexEditorForm.markAsUntouched();
    this.latexEditorForm.updateValueAndValidity();

    this.snackbar.open(`Successfully saved expression`, 'Close', { duration: SNACKBAR_INTERVAL.NORMAL });
  }

  loadExpression(id: number) {
    const currentSaved = this._savedExpressions();

    const expression = currentSaved.find((e) => e.id === id)?.expression ?? '';

    this.latexEditorForm.reset({ latex: expression }, { emitEvent: false });
    this.saveCurrentExpression(expression, false, false);
  }

  removeExpression(id: number) {
    const currentSaved = this._savedExpressions();

    const newExpressions = currentSaved.filter((e) => e.id !== id);

    this._savedExpressions.set(newExpressions);
    this.saveExpressions(newExpressions);

    this.snackbar.open(`Successfully removed expression`, 'Close', { duration: SNACKBAR_INTERVAL.NORMAL });
  }

  /** PRIVATE FUNCTIONS */
  private filterCommandSection(filter: string): LatexSection[] {
    const commandSections = this.latexCommandSections();

    filter = filter.trim().toLowerCase();

    if (!filter) {
      return commandSections;
    }

    return commandSections
      .map((section) => ({
        ...section,
        commands: section.commands.filter((cmd) => cmd.label.toLowerCase().includes(filter) || cmd.value.toLowerCase().includes(filter)),
      }))
      .filter((section) => section.commands.length > 0);
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

  private saveCurrentExpression(currentExpression: string, isTouched: boolean, isDirty: boolean) {
    const currentExpressionState = {
      expression: currentExpression,
      isTouched,
      isDirty,
    };

    localStorage.setItem(STORAGE_KEYS.LATEX_EDITOR.CURRENT_EXPRESSION, JSON.stringify(currentExpressionState));
  }

  private loadCurrentExpression(): SavedCurrentExpression {
    const currentExpression = localStorage.getItem(STORAGE_KEYS.LATEX_EDITOR.CURRENT_EXPRESSION);

    if (!currentExpression) {
      return {
        expression: '',
        isTouched: false,
        isDirty: false,
      };
    }

    try {
      return JSON.parse(currentExpression);
    } catch (error) {
      return {
        expression: '',
        isTouched: false,
        isDirty: false,
      };
    }
  }

  private saveExpressions(savedExpressions: SavedExpression[]) {
    localStorage.setItem(STORAGE_KEYS.LATEX_EDITOR.SAVED_EXPRESSIONS, JSON.stringify(savedExpressions));
  }

  private loadExpressions(): SavedExpression[] {
    const savedExpressions = localStorage.getItem(STORAGE_KEYS.LATEX_EDITOR.SAVED_EXPRESSIONS);

    if (!savedExpressions) {
      return [];
    }

    try {
      return JSON.parse(savedExpressions);
    } catch (error) {
      return [];
    }
  }
}
