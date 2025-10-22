import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { MatListModule } from '@angular/material/list';

import { LatexEditorService } from './latex-editor.service';
import { HzCardModule } from '@hz/shared/components';

@Component({
  selector: 'hz-latex-editor',
  imports: [
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSliderModule,
    MatListModule,
    HzCardModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './latex-editor.component.html',
  styleUrl: './latex-editor.component.scss',
})
export class LatexEditorComponent {
  private latexEditorService = inject(LatexEditorService);

  readonly textInput = this.latexEditorService.textInput;
  readonly renderedLatex = this.latexEditorService.renderedLatex;
  readonly renderSize = this.latexEditorService.renderSize;

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
