import { Component, computed, effect, inject, input, output, signal } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';

import { SNACKBAR_INTERVAL } from '@hz/core/constants';

@Component({
  selector: 'hz-file-input',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './file-input.component.html',
  styleUrl: './file-input.component.scss',
})
export class FileInputComponent {
  private snackbar = inject(MatSnackBar);

  readonly allowedExtensions = input<string[]>([]);
  readonly maxAllowedFiles = input<number>(1);

  readonly outputSelectedFiles = output<File[]>();

  readonly isDragOver = signal<boolean>(false);
  readonly selectedFiles = signal<File[]>([]);

  readonly hasAllowedExtensions = computed(() => this.allowedExtensions() && this.allowedExtensions().length > 0);
  readonly numFilesAllowed = computed(() => Math.max(this.maxAllowedFiles() - this.selectedFiles().length, 0));
  readonly isFileLimitReached = computed(() => this.selectedFiles().length >= this.maxAllowedFiles());

  constructor() {
    effect(() => this.outputSelectedFiles.emit(this.selectedFiles()));
  }

  onFileDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(false);

    if (!event.dataTransfer || !event.dataTransfer.files) {
      return;
    }

    const files = Array.from(event.dataTransfer.files);
    this.addFiles(files);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || !input.files.length) {
      return;
    }

    const files: File[] = Array.from(input.files);
    this.addFiles(files);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(true);
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(false);
  }

  addFiles(newFiles: File[]) {
    const files = this.selectedFiles();

    // Filter extensions of not allowed
    if (this.hasAllowedExtensions()) {
      const allowedExtensions = this.allowedExtensions();
      newFiles = newFiles.filter((file) => allowedExtensions.some((ext) => file.name.toLowerCase().endsWith(ext)));
    }

    // Limit maximum new files
    if (newFiles.length > this.numFilesAllowed()) {
      console.log(this.numFilesAllowed());
      newFiles = newFiles.slice(0, this.numFilesAllowed());
    }

    const updatedFiles = [...files, ...newFiles];

    if (updatedFiles.length > 0) {
      this.selectedFiles.set(updatedFiles);

      // Display Snackbar for one or multiple
      this.snackbar.open('Successfully Added File(s)', 'Close', { duration: SNACKBAR_INTERVAL.NORMAL });
    } else {
      this.snackbar.open('No File(s) added', 'Close', { duration: SNACKBAR_INTERVAL.NORMAL });
    }
  }
}
