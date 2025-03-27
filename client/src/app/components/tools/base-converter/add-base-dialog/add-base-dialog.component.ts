import { Component, inject } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ValidatorMessagePipe } from '../../../../pipes/validator-message.pipe';
import { MatSelectModule } from '@angular/material/select';
import { baseNames } from '../../../../utilities/base-conversion.util';
import { range } from '../../../../utilities/range.util';

interface DialogData {
  existingBases: number[];
}

interface DialogResult {
  status: boolean;
  base: number;
}

@Component({
  selector: 'app-add-base-dialog',
  imports: [MatButtonModule, MatInputModule, MatDialogModule, MatSelectModule, ReactiveFormsModule, ValidatorMessagePipe],
  templateUrl: './add-base-dialog.component.html',
  styleUrl: './add-base-dialog.component.scss',
})
export class AddBaseDialogComponent {
  private fb = inject(FormBuilder);

  readonly dialogRef = inject(MatDialogRef<AddBaseDialogComponent>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  readonly baseForm = this.getBaseForm();
  readonly baseNames = baseNames;
  readonly usableBases = range(2, 36+1).filter((base) => !this.data.existingBases.includes(base));

  getBaseForm() {
    return this.fb.group({
      base: [null, [Validators.required]],
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
      base: this.baseForm.value.base ?? 0,
    };

    this.dialogRef.close(dialogResult);
  }
}
