import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';

import { Link } from '../link-library';

interface DialogData {
  link: Link;
}

@Component({
  selector: 'app-link-library-dialog',
  imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent, MatChipsModule],
  templateUrl: './link-library-dialog.component.html',
  styleUrl: './link-library-dialog.component.scss',
})
export class LinkLibraryDialogComponent {
  readonly dialogRef = inject(MatDialogRef<LinkLibraryDialogComponent>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  readonly link = signal(this.data.link);

  constructor() {}

  onClose() {
    this.dialogRef.close();
  }
}
