import { Component, inject, OnInit } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { ValidatorMessagePipe } from '../../../../core/pipes/validator-message.pipe';
import { uniqueText } from '../../../../core/validators/unique-text.validator';
import { LinkLibraryManagementService } from '../link-library-management.service';
import { Tag, TagPayload } from '../link-library-management';

interface DialogData {
  type: 'create' | 'update';
  tag?: Tag;
}

interface DialogResult {
  status: boolean;
  tag: TagPayload;
}

@Component({
  selector: 'hz-link-tag-dialog',
  imports: [MatButtonModule, MatInputModule, MatDialogModule, MatDividerModule, ReactiveFormsModule, ValidatorMessagePipe],
  templateUrl: './link-tag-dialog.component.html',
  styleUrl: './link-tag-dialog.component.scss',
})
export class LinkTagDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private linkLibraryManagementService = inject(LinkLibraryManagementService);

  private dialogRef = inject(MatDialogRef<LinkTagDialogComponent>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  readonly tagForm = this.getNewTagForm();

  ngOnInit() {
    const existingTags = this.linkLibraryManagementService.linkTagList();

    if (this.data.type === 'update' && this.data.tag) {
      const tag = this.data.tag;
      const existingTagsIgnoreCurrent = existingTags.filter((item) => item !== tag.name);

      this.tagForm.patchValue({
        name: tag.name,
      });

      this.tagForm.get('name')?.addValidators([uniqueText(existingTagsIgnoreCurrent)]);
    } else {
      this.tagForm.get('name')?.addValidators([uniqueText(existingTags)]);
    }
  }

  getNewTagForm() {
    return this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(30)]],
    });
  }

  onCancel() {
    this.dialogRef.close({
      status: false,
    });
  }

  onConfirm() {
    if (this.tagForm.invalid || !this.tagForm.dirty) {
      return;
    }

    const name = this.tagForm.value.name ?? '';
    const existingName = this.data.tag?.name ?? '';

    // Ignore matching name
    if (existingName && name === existingName) {
      this.dialogRef.close({
        status: false,
      });
    } else {
      const dialogResult: DialogResult = {
        status: true,
        tag: {
          name,
        },
      };

      this.dialogRef.close(dialogResult);
    }
  }
}
