import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { SecureUrlPipe } from '@hz/core/pipes';

export interface HzImageViewDialogData {
  images: string[] | string;
  startIndex?: number;
  label?: string;
}

@Component({
  selector: 'hz-image-view-dialog',
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, SecureUrlPipe],
  templateUrl: './hz-image-view-dialog.component.html',
  styleUrl: './hz-image-view-dialog.component.scss',
})
export class HzImageViewDialogComponent {
  readonly dialogRef = inject(MatDialogRef<HzImageViewDialogComponent>);
  readonly data = inject<HzImageViewDialogData>(MAT_DIALOG_DATA);

  readonly images = signal(Array.isArray(this.data.images) ? this.data.images : [this.data.images]);
  readonly index = signal(this.data.startIndex ?? 0);
  readonly currentImage = computed(() => this.images()[this.index()]);
  readonly hasMultiple = computed(() => this.images().length > 1);

  onClose() {
    this.dialogRef.close();
  }

  onNext() {
    this.index.update((i) => (i + 1) % this.images().length);
  }

  onPrev() {
    this.index.update((i) => (i - 1 + this.images().length) % this.images().length);
  }
}
