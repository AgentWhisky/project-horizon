import { Component, inject } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { LinkCategoryCode, NewLinkCategory } from '../../../../types/link-library';
import { uniqueText } from '../../../../validators/unique-text.validator';
import { LinkLibraryService } from '../../../../services/link-library.service';

interface DialogData {
  type: 'create' | 'update';
  category?: LinkCategoryCode;
}

interface DialogResult {
  status: boolean;
  category: NewLinkCategory;
}

@Component({
  selector: 'app-link-category-dialog',
  imports: [MatButtonModule, MatInputModule, MatDialogModule, ReactiveFormsModule],
  templateUrl: './link-category-dialog.component.html',
  styleUrl: './link-category-dialog.component.scss',
})
export class LinkCategoryDialogComponent {
  private fb = inject(FormBuilder);
  private linkLibraryService = inject(LinkLibraryService);

  readonly dialogRef = inject(MatDialogRef<LinkCategoryDialogComponent>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  readonly categoryForm =
    this.data.type === 'update' && this.data.category ? this.getUpdateCategoryForm(this.data.category) : this.getNewCategoryForm();

  getNewCategoryForm() {
    return this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(30), uniqueText(this.linkLibraryService.linkCategoryList())]],
      description: ['', [Validators.required, Validators.maxLength(250)]],
    });
  }

  getUpdateCategoryForm(category: LinkCategoryCode) {
    return this.fb.group({
      name: [category.name, [Validators.required, Validators.maxLength(30), uniqueText(this.linkLibraryService.linkCategoryList())]],
      description: [category.description, [Validators.required, Validators.maxLength(250)]],
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
      category: {
        name: this.categoryForm.value.name ?? '',
        description: this.categoryForm.value.description ?? '',
      },
    };

    this.dialogRef.close(dialogResult);
  }
}
