import { Component, inject } from '@angular/core';
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
  readonly renderedLatex = this.latexEditorService.renderedLatex;
  readonly renderSize = this.latexEditorService.renderSize;

  readonly commandPaletteCMDs: HzCommand[] = LATEX_MENU.flatMap((section) =>
    section.commands.map((command) => ({
      label: command.label,
      value: command.value,
      latex: command.value,
    }))
  );
  readonly latexMenu = LATEX_MENU;

  onResetTextInput() {
    this.latexEditorService.resetTextInput();
  }

  onInsertAtCursor(textArea: HTMLTextAreaElement, text: string) {
    this.latexEditorService.insertAtCursor(textArea, text);
  }

  onCopyTextInput() {
    this.latexEditorService.copyTextInput();
  }
}
