import { Component, inject } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { LinkCategoryCode, LinkTagCode, NewLinkCategory, NewLinkTag } from '../../../../types/link-library';
import { uniqueText } from '../../../../validators/unique-text.validator';
import { LinkLibraryService } from '../../../../services/link-library.service';

interface DialogData {
  type: 'create' | 'update';
  tag?: LinkTagCode;
}

interface DialogResult {
  status: boolean;
  tag: NewLinkTag;
}

@Component({
  selector: 'app-link-tag-dialog',
  imports: [MatButtonModule, MatInputModule, MatDialogModule, ReactiveFormsModule],
  templateUrl: './link-tag-dialog.component.html',
  styleUrl: './link-tag-dialog.component.scss',
})
export class LinkTagDialogComponent {
  readonly dialogRef = inject(MatDialogRef<LinkTagDialogComponent>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  readonly tagForm = this.data.type === 'update' && this.data.tag ? this.getUpdateTagForm(this.data.tag) : this.getNewTagForm();

  constructor(private fb: FormBuilder, private linkLibraryService: LinkLibraryService) {}

  getNewTagForm() {
    return this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(30), uniqueText(this.linkLibraryService.linkTagList())]],
    });
  }

  getUpdateTagForm(tag: LinkTagCode) {
    return this.fb.group({
      name: [tag.name, [Validators.required, Validators.maxLength(30), uniqueText(this.linkLibraryService.linkTagList())]],
    });
  }

  onClose() {
    this.dialogRef.close({
      status: false,
    });
  }

  onComplete() {
    const dialogResult: DialogResult = {
      status: true,
      tag: {
        name: this.tagForm.value.name ?? '',
      },
    };

    this.dialogRef.close(dialogResult);
  }
}
