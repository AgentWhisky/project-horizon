import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';

import { LatexEditorService } from './latex-editor.service';
import { HzCardModule, HzCommandPaletteModule } from '@hz/shared/components';
import { KatexPipe } from '@hz/core/pipes/katex.pipe';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LatexCommand } from './resources/latex-editor.model';
import { MatDialog } from '@angular/material/dialog';
import { SaveExpressionDialogComponent } from './save-expression-dialog/save-expression-dialog.component';
import { filter, tap } from 'rxjs';
import { ConfirmDialogComponent } from '@hz/shared/dialogs';

@Component({
  selector: 'hz-latex-editor',
  imports: [
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSliderModule,
    MatListModule,
    MatExpansionModule,
    MatTooltipModule,
    HzCardModule,
    HzCardModule,
    HzCommandPaletteModule,
    ReactiveFormsModule,
    FormsModule,
    KatexPipe,
  ],
  templateUrl: './latex-editor.component.html',
  styleUrl: './latex-editor.component.scss',
})
export class LatexEditorComponent {
  private latexEditorService = inject(LatexEditorService);
  private dialog = inject(MatDialog);

  readonly latexEditorForm = this.latexEditorService.latexEditorForm;
  readonly commandHistory = this.latexEditorService.sortedCommandHistory;
  readonly savedExpressions = this.latexEditorService.savedExpressions;

  readonly renderSize = this.latexEditorService.renderSize;

  readonly commandFilter = this.latexEditorService.commandFilter;
  readonly filteredLatexCommands = this.latexEditorService.filteredLatexCommands;

  @ViewChild('latexEditorInput') latexEditorInput!: ElementRef<HTMLTextAreaElement>;

  onInsertAtCursor(command: LatexCommand) {
    this.latexEditorService.insertAtCursor(this.latexEditorInput.nativeElement, command);
  }

  onResetTextInput() {
    if (this.latexEditorForm.dirty) {
      const title = 'Clear Expression';
      const message = 'You have unsaved changes. Are you sure you want to clear this expression?';

      this.dialog
        .open(ConfirmDialogComponent, { data: { title, message }, panelClass: 'hz-dialog-container' })
        .afterClosed()
        .pipe(
          filter((result) => result),
          tap(() => this.latexEditorService.resetTextInput())
        )
        .subscribe();
    } else {
      this.latexEditorService.resetTextInput();
    }
  }

  onCopyExpression(expression?: string) {
    this.latexEditorService.copyExpression(expression);
  }

  onSaveExpression() {
    this.dialog
      .open(SaveExpressionDialogComponent, { panelClass: 'hz-dialog-container', width: '560px' })
      .afterClosed()
      .pipe(
        filter((result) => result),
        tap((result) => this.latexEditorService.saveExpression(result.name))
      )
      .subscribe();
  }

  onLoadExpression(id: number) {
    if (this.latexEditorForm.dirty) {
      const title = 'Load Expression';
      const message = 'You have unsaved changes. Are you sure you want to load this expression?';

      this.dialog
        .open(ConfirmDialogComponent, { data: { title, message }, panelClass: 'hz-dialog-container' })
        .afterClosed()
        .pipe(
          filter((result) => result),
          tap(() => this.latexEditorService.loadExpression(id))
        )
        .subscribe();
    } else {
      this.latexEditorService.loadExpression(id);
    }
  }

  onRemoveExpression(id: number) {
    const title = 'Remove Expression';
    const message = 'Are you sure you want to remove this expression?';

    this.dialog
      .open(ConfirmDialogComponent, { data: { title, message }, panelClass: 'hz-dialog-container' })
      .afterClosed()
      .pipe(
        filter((result) => result),
        tap(() => this.latexEditorService.removeExpression(id))
      )
      .subscribe();
  }
}
