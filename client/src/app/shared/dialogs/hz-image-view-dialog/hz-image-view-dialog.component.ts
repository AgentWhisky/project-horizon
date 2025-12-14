
import { Component, computed, inject, Injectable, OnInit, signal, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SecureUrlPipe } from '@hz/core/pipes';
import { Subject } from 'rxjs';

export interface HzImageViewDialogData {
  images: string[] | string;
  startIndex?: number;
  context?: string;
}

@Injectable()
export class MyCustomPaginatorIntl implements MatPaginatorIntl {
  changes = new Subject<void>();

  firstPageLabel = 'First image';
  lastPageLabel = 'Last image';
  nextPageLabel = 'Next image';
  previousPageLabel = 'Previous image';
  itemsPerPageLabel = 'Items per page:';

  getRangeLabel(page: number, pageSize: number, length: number): string {
    if (length === 0) {
      return 'Image 1 of 1';
    }
    const amountPages = Math.ceil(length / pageSize);
    return `Image ${page + 1} of ${amountPages}`;
  }
}

@Component({
  selector: 'hz-image-view-dialog',
  imports: [MatDialogModule, MatButtonModule, MatIconModule, MatPaginatorModule, MatTooltipModule, SecureUrlPipe],
  templateUrl: './hz-image-view-dialog.component.html',
  styleUrl: './hz-image-view-dialog.component.scss',
  providers: [{ provide: MatPaginatorIntl, useClass: MyCustomPaginatorIntl }],
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
