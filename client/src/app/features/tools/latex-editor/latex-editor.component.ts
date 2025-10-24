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
import { HzCardModule, HzCommand, HzCommandPaletteModule } from '@hz/shared/components';
import { LATEX_MENU } from './resources/latex-editor.constants';
import { KatexPipe } from '@hz/core/pipes/katex.pipe';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TitleCasePipe } from '@angular/common';
import { LatexCommand } from './resources/latex-editor.model';

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

  readonly textInput = this.latexEditorService.textInput;
  readonly commandHistory = this.latexEditorService.sortedCommandHistory;

  readonly renderSize = this.latexEditorService.renderSize;

  readonly commandPaletteCMDs = this.latexEditorService.commandPaletteCMDs;
  readonly commandLookup = this.latexEditorService.commandLookup;

  readonly latexMenu = LATEX_MENU;

  @ViewChild('latexEditorInput') latexEditorInput!: ElementRef<HTMLTextAreaElement>;

  onInsertAtCursor(command: LatexCommand) {
    this.latexEditorService.insertAtCursor(this.latexEditorInput.nativeElement, command);
  }

  onSelectPaletteCommand(cmd: HzCommand) {
    const latexCommand = this.commandLookup.get(cmd.id);
    if (latexCommand) {
      this.latexEditorService.insertAtCursor(this.latexEditorInput.nativeElement, latexCommand);
    }
  }

  onResetTextInput() {
    this.latexEditorService.resetTextInput();
  }

  onCopyExpression() {
    this.latexEditorService.copyExpression();
  }

  onSaveExpression() {}
}
