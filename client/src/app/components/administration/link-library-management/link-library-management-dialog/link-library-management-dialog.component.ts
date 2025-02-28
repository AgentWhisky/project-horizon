import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { Link, NewLink } from '../../../../types/link-library';
import { LinkLibraryService } from '../../../../services/link-library.service';

interface DialogData {
  type: 'create' | 'update';
  link?: Link;
}

interface DialogResult {
  status: boolean;
  linkData: NewLink | null;
}

@Component({
  selector: 'app-link-library-management-dialog',
  imports: [MatButtonModule, MatInputModule, MatSelectModule, MatDialogModule, ReactiveFormsModule],
  templateUrl: './link-library-management-dialog.component.html',
  styleUrl: './link-library-management-dialog.component.scss',
})
export class LinkLibraryManagementDialogComponent {
  private fb = inject(FormBuilder);
  private linkLibraryService = inject(LinkLibraryService);
  private dialogRef = inject(MatDialogRef<LinkLibraryManagementDialogComponent>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  readonly linkCategories = this.linkLibraryService.linkCategories;
  readonly linkTags = this.linkLibraryService.linkTags;

  readonly linkForm = this.data.type === 'update' && this.data.link ? this.getUpdateLinkForm(this.data.link) : this.getNewLinkForm();
  
  getNewLinkForm() {
    return this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(30)]],
      description: ['', [Validators.required, Validators.maxLength(250)]],
      url: ['', [Validators.required, Validators.maxLength(250)]],
      thumbnail: [''],
      category: [null, [Validators.required]],
      tags: [[], [Validators.required]],
    });
  }

  getUpdateLinkForm(link: Link) {
    return this.fb.group({
      name: [link.name, [Validators.required, Validators.maxLength(30)]],
      description: [link.description, [Validators.required, Validators.maxLength(250)]],
      url: [link.url, [Validators.required, Validators.maxLength(250)]],
      thumbnail: [link.thumbnail],
      category: [link.category.id ?? '', [Validators.required]],
      tags: [link.tags?.map((tag) => tag.id) ?? [], [Validators.required]],
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
      linkData: {
        name: this.linkForm.value.name ?? '',
        url: this.linkForm.value.url ?? '',
        description: this.linkForm.value.description ?? '',
        category: this.linkForm.value.category ?? 0,
        tags: this.linkForm.value.tags ?? [],
      },
    };

    this.dialogRef.close(dialogResult);
  }
}
