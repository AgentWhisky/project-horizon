import { Component, inject } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { uniqueText } from '../../../../validators/unique-text.validator';
import { Tag, TagPayload } from '../link-library-management';
import { LinkLibraryManagementService } from '../link-library-management.service';

interface DialogData {
  type: 'create' | 'update';
  tag?: Tag;
}

interface DialogResult {
  status: boolean;
  tag: TagPayload;
}

@Component({
  selector: 'app-link-tag-dialog',
  imports: [MatButtonModule, MatInputModule, MatDialogModule, ReactiveFormsModule],
  templateUrl: './link-tag-dialog.component.html',
  styleUrl: './link-tag-dialog.component.scss',
})
export class LinkTagDialogComponent {
  private fb = inject(FormBuilder);
  private linkLibraryManagementService = inject(LinkLibraryManagementService);
  private dialogRef = inject(MatDialogRef<LinkTagDialogComponent>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  readonly tagForm = this.data.type === 'update' && this.data.tag ? this.getUpdateTagForm(this.data.tag) : this.getNewTagForm();

  getNewTagForm() {
    return this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(30), uniqueText(this.linkLibraryManagementService.linkTagList())]],
    });
  }

  getUpdateTagForm(tag: Tag) {
    return this.fb.group({
      name: [tag.name, [Validators.required, Validators.maxLength(30), uniqueText(this.linkLibraryManagementService.linkTagList())]],
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
      tag: {
        name: this.tagForm.value.name ?? '',
      },
    };

    this.dialogRef.close(dialogResult);
  }
}
