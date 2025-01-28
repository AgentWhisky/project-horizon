import { Component, inject } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { RightCode, RightPayload } from '../account-management';

interface DialogData {
  type: 'create' | 'update';
  right?: RightCode;
}

interface DialogResult {
  status: boolean;
  rightData: RightPayload;
}

@Component({
  selector: 'app-right-dialog',
  imports: [MatButtonModule, MatInputModule, MatDialogModule, ReactiveFormsModule],
  templateUrl: './right-dialog.component.html',
  styleUrl: './right-dialog.component.scss',
})
export class RightDialogComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<RightDialogComponent>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  readonly rightForm = this.getRightForm(this.data.type === 'update', this.data.right);

  getRightForm(isUpdate: boolean, right?: RightCode) {
    const newForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(30)]],
      description: ['', [Validators.required, Validators.maxLength(250)]],
    });

    if (isUpdate && right) {
      newForm.patchValue({
        name: right.name,
        description: right.description,
      });
    }

    return newForm;
  }
  
  onSubmit() {
    const dialogResult: DialogResult = {
      status: true,
      rightData: {
        name: this.rightForm.value.name ?? '',
        description: this.rightForm.value.description ?? '',
      },
    };

    this.dialogRef.close(dialogResult);
  }
}
