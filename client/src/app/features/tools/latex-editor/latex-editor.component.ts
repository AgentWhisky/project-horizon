import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';

import { LatexEditorService } from './latex-editor.service';

@Component({
  selector: 'hz-latex-editor',
  imports: [MatInputModule, MatCardModule, MatButtonModule, MatIconModule, MatSliderModule, ReactiveFormsModule, FormsModule],
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

  onCopyTextInput() {
    this.latexEditorService.copyTextInput();
  }
}
