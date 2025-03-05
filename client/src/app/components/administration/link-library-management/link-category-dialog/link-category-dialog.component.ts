import { Component, inject } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { Category, CategoryPayload } from '../link-library-management';
import { LinkLibraryManagementService } from '../link-library-management.service';
import { uniqueText } from '../../../../validators/unique-text.validator';

interface DialogData {
  type: 'create' | 'update';
  category?: Category;
}

interface DialogResult {
  status: boolean;
  category: CategoryPayload;
}

@Component({
  selector: 'app-link-category-dialog',
  imports: [MatButtonModule, MatInputModule, MatDialogModule, ReactiveFormsModule],
  templateUrl: './link-category-dialog.component.html',
  styleUrl: './link-category-dialog.component.scss',
})
export class LinkCategoryDialogComponent {
  private fb = inject(FormBuilder);
  private linkLibraryManagementService = inject(LinkLibraryManagementService);

  readonly dialogRef = inject(MatDialogRef<LinkCategoryDialogComponent>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  readonly categoryForm =
    this.data.type === 'update' && this.data.category ? this.getUpdateCategoryForm(this.data.category) : this.getNewCategoryForm();

  getNewCategoryForm() {
    return this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(30), uniqueText(this.linkLibraryManagementService.linkCategoryList())]],
      description: ['', [Validators.required, Validators.maxLength(250)]],
    });
  }

  getUpdateCategoryForm(category: Category) {
    return this.fb.group({
      name: [
        category.name,
        [Validators.required, Validators.maxLength(30), uniqueText(this.linkLibraryManagementService.linkCategoryList())],
      ],
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
