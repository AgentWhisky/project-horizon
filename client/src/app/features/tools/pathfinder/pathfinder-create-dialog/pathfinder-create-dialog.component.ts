import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BaseConvertConversionDialogComponent } from '../../base-converter/base-convert-conversion-dialog/base-convert-conversion-dialog.component';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { ValidatorMessagePipe } from '../../../../core/pipes/validator-message.pipe';

interface DialogResult {
  status: boolean;
  rows: number;
  columns: number;
}

@Component({
  selector: 'hz-pathfinder-create-dialog',
  imports: [MatButtonModule, MatInputModule, MatDialogModule, ReactiveFormsModule, ValidatorMessagePipe],
  templateUrl: './pathfinder-create-dialog.component.html',
  styleUrl: './pathfinder-create-dialog.component.scss',
})
export class PathfinderCreateDialogComponent {
  private fb = inject(FormBuilder);
  readonly dialogRef = inject(MatDialogRef<BaseConvertConversionDialogComponent>);

  readonly createForm = this.getCreateForm();

  getCreateForm() {
    return this.fb.group({
      rows: this.fb.control<number | null>(null, [Validators.required, Validators.min(1), Validators.max(50)]),
      columns: this.fb.control<number | null>(null, [Validators.required, Validators.min(1), Validators.max(50)]),
    });
  }

  onClose() {
    this.dialogRef.close({
      status: false,
    });
  }

  onSubmit() {
    const dialogResult: DialogResult = {
      status: true,
      rows: this.createForm.get('rows')?.value ?? 1,
      columns: this.createForm.get('columns')?.value ?? 1,
    };

    this.dialogRef.close(dialogResult);
  }
}
