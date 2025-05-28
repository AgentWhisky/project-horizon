import { Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FileInputComponent } from '../../../../shared/components/file-input/file-input.component';

interface DialogResult {
  status: boolean;
  file: File;
}

@Component({
  selector: 'hz-link-library-import-dialog',
  imports: [MatButtonModule, MatInputModule, MatDialogModule, FileInputComponent],
  templateUrl: './link-library-import-dialog.component.html',
  styleUrl: './link-library-import-dialog.component.scss',
})
export class LinkLibraryImportDialogComponent {
  private dialogRef = inject(MatDialogRef<LinkLibraryImportDialogComponent>);

  readonly selectedFile = signal<File | null>(null);
  readonly isFileSelected = computed(() => !!this.selectedFile());

  onUpdateFiles(files: File[]) {
    this.selectedFile.set(files[0]);
  }

  onClose() {
    this.dialogRef.close({
      status: false,
    });
  }

  onSubmit() {
    const file = this.selectedFile();

    if (file) {
      const dialogResult: DialogResult = {
        status: true,
        file,
      };

      this.dialogRef.close(dialogResult);
    }
  }
}
