import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { SecureUrlPipe } from '@hz/core/pipes';

export interface HzImageViewDialogData {
  images: string[] | string;
  startIndex?: number;
  context?: string;
}

@Component({
  selector: 'hz-image-view-dialog',
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, MatPaginatorModule, SecureUrlPipe],
  templateUrl: './hz-image-view-dialog.component.html',
  styleUrl: './hz-image-view-dialog.component.scss',
})
export class HzImageViewDialogComponent {
  readonly dialogRef = inject(MatDialogRef<HzImageViewDialogComponent>);
  readonly data = inject<HzImageViewDialogData>(MAT_DIALOG_DATA);

  readonly images = signal(Array.isArray(this.data.images) ? this.data.images : [this.data.images]);
  readonly pageIndex = signal(this.data.startIndex ?? 0);
  readonly context = signal(this.data.context ?? 'Image viewer content');

  readonly pageLength = signal(this.images().length);
  readonly currentImage = signal(this.images()[this.pageIndex()]);
  readonly hasMultiple = computed(() => this.images().length > 1);

  onClose() {
    this.dialogRef.close();
  }

  onPageChange(event: PageEvent) {
    const newIndex = event.pageIndex;

    this.pageIndex.set(event.pageIndex);
    this.currentImage.set(this.images()[newIndex]);
  }
}
