import { Component, inject } from '@angular/core';
import { LatexEditorService } from '../latex-editor.service';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ValidatorMessagePipe } from '@hz/core/pipes';
import { uniqueText } from '@hz/core/validators';
import { MatButtonModule } from '@angular/material/button';

interface DialogResult {
  name: string;
}

@Component({
  selector: 'hz-save-expression-dialog',
  imports: [MatDialogModule, MatInputModule, MatButtonModule, ReactiveFormsModule, ValidatorMessagePipe],
  templateUrl: './save-expression-dialog.component.html',
  styleUrl: './save-expression-dialog.component.scss',
})
export class SaveExpressionDialogComponent {
  private fb = inject(FormBuilder);
  private latexEditorService = inject(LatexEditorService);
  readonly dialogRef = inject(MatDialogRef<SaveExpressionDialogComponent>);

  readonly savedExpressions = this.latexEditorService.savedExpressions;

  readonly saveExpressionForm = this.fb.group({
    expressionName: ['', [Validators.required, Validators.maxLength(32), uniqueText(this.savedExpressions().map((e) => e.name))]],
  });

  onClose() {
    this.dialogRef.close();
  }

  onSubmit() {
    const dialogResult: DialogResult = {
      name: this.saveExpressionForm.controls.expressionName.value ?? '',
    };

    this.dialogRef.close(dialogResult);
  }
}
