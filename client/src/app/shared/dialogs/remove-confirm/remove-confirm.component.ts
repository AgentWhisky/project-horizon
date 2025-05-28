import { Component, inject } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

interface DialogData {
  message: string;
  metaData: string;
}

@Component({
  selector: 'hz-remove-confirm',
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './remove-confirm.component.html',
  styleUrl: './remove-confirm.component.scss',
})
export class RemoveConfirmComponent {
  readonly dialogRef = inject(MatDialogRef<RemoveConfirmComponent>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  onConfirm() {
    this.dialogRef.close(true);
  }

  onCancel() {
    this.dialogRef.close(false);
  }
}
