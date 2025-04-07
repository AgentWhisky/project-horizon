import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { LinkLibraryManagementService } from '../link-library-management.service';
import { FileInputComponent } from '../../../../core/file-input/file-input.component';

interface DialogResult {
  status: boolean;
}

@Component({
  selector: 'app-link-library-import-dialog',
  imports: [MatButtonModule, MatInputModule, MatDialogModule, FileInputComponent],
  templateUrl: './link-library-import-dialog.component.html',
  styleUrl: './link-library-import-dialog.component.scss',
})
export class LinkLibraryImportDialogComponent {
  private linkLibraryManagementService = inject(LinkLibraryManagementService);
  private dialogRef = inject(MatDialogRef<LinkLibraryImportDialogComponent>);

  readonly selectedFiles = signal<File[]>([]);

  onUpdateFiles(files: File[]) {
    this.selectedFiles.set([...files]);
  }

  onClose() {
    this.dialogRef.close({
      status: false,
    });
  }

  onSubmit() {
    const dialogResult: DialogResult = {
      status: true,
    };

    this.dialogRef.close(dialogResult);
  }
}
