import { Component, inject, OnInit } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { Category, CategoryPayload } from '../link-library-management';
import { LinkLibraryManagementService } from '../link-library-management.service';
import { uniqueText } from '../../../../core/validators/unique-text.validator';
import { ValidatorMessagePipe } from '../../../../core/pipes/validator-message.pipe';
import { MatDividerModule } from '@angular/material/divider';

interface DialogData {
  type: 'create' | 'update';
  category?: Category;
}

interface DialogResult {
  status: boolean;
  category: CategoryPayload;
}

@Component({
  selector: 'hz-link-category-dialog',
  imports: [MatButtonModule, MatInputModule, MatDialogModule, MatDividerModule, ReactiveFormsModule, ValidatorMessagePipe],
  templateUrl: './link-category-dialog.component.html',
  styleUrl: './link-category-dialog.component.scss',
})
export class LinkCategoryDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private linkLibraryManagementService = inject(LinkLibraryManagementService);

  readonly dialogRef = inject(MatDialogRef<LinkCategoryDialogComponent>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  readonly categoryForm = this.getNewCategoryForm();

  ngOnInit() {
    const existingCategories = this.linkLibraryManagementService.linkCategoryList();

    if (this.data.type === 'update' && this.data.category) {
      const category = this.data.category;
      const existingCategoriesIgnoreCurrent = existingCategories.filter((item) => item !== category.name);

      this.categoryForm.patchValue({
        name: category.name,
        description: category.description,
      });

      this.categoryForm.get('name')?.addValidators([uniqueText(existingCategoriesIgnoreCurrent)]);
    } else {
      this.categoryForm.get('name')?.addValidators([uniqueText(existingCategories)]);
    }
  }

  getNewCategoryForm() {
    return this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(30)]],
      description: ['', [Validators.required, Validators.maxLength(250)]],
    });
  }

  onCancel() {
    this.dialogRef.close({
      status: false,
    });
  }

  onConfirm() {
    if (this.categoryForm.invalid || !this.categoryForm.dirty) {
      return;
    }

    const name = this.categoryForm.value.name ?? '';
    const description = this.categoryForm.value.description ?? '';

    // Check for any changes
    const existingName = this.data.category?.name ?? '';
    const existingDescription = this.data.category?.description ?? '';
    const noChanges = name === existingName && description === existingDescription;

    if (existingName && existingDescription && noChanges) {
      this.dialogRef.close({
        status: false,
      });
    } else {
      const dialogResult: DialogResult = {
        status: true,
        category: {
          name,
          description,
        },
      };

      this.dialogRef.close(dialogResult);
    }
  }
}
