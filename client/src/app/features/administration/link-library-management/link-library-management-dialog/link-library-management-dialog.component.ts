import { Component, inject, OnInit } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { ValidatorMessagePipe } from '../../../../core/pipes/validator-message.pipe';
import { REGEX } from '../../../../core/constants/regex.constant';
import { checkFaviconExists } from '../../../../core/utilities/favicon.util';
import { LinkLibraryManagementService } from '../link-library-management.service';
import { Link, LinkPayload } from '../link-library-management';

interface DialogData {
  type: 'create' | 'update';
  link?: Link;
}

interface DialogResult {
  status: boolean;
  linkData: LinkPayload;
}

@Component({
  selector: 'hz-link-library-management-dialog',
  imports: [
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatDividerModule,
    MatDialogModule,
    ReactiveFormsModule,
    ValidatorMessagePipe,
  ],
  templateUrl: './link-library-management-dialog.component.html',
  styleUrl: './link-library-management-dialog.component.scss',
})
export class LinkLibraryManagementDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private snackbar = inject(MatSnackBar);
  private linkLibraryManagementService = inject(LinkLibraryManagementService);

  private dialogRef = inject(MatDialogRef<LinkLibraryManagementDialogComponent>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  readonly linkCategories = this.linkLibraryManagementService.linkCategories;
  readonly linkTags = this.linkLibraryManagementService.linkTags;

  readonly linkForm = this.getNewLinkForm();

  ngOnInit() {
    if (this.data.type === 'update' && this.data.link) {
      const link = this.data.link;

      this.linkForm.patchValue({
        name: link.name,
        description: link.description,
        url: link.url,
        icon: link.icon,
        tags: link.tags?.map((tag) => tag.id) ?? [],
      });
    }
  }

  getNewLinkForm() {
    return this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(30)]],
      description: ['', [Validators.required, Validators.maxLength(250)]],
      url: ['', [Validators.required, Validators.maxLength(2048), Validators.pattern(REGEX.URL)]],
      icon: ['', [Validators.maxLength(2048), Validators.pattern(REGEX.URL)]],
      tags: [[] as number[]],
    });
  }

  onCancel() {
    this.dialogRef.close({
      status: false,
    });
  }

  onConfirm() {
    if (this.linkForm.invalid || !this.linkForm.dirty) {
      return;
    }

    const dialogResult: DialogResult = {
      status: true,
      linkData: {
        name: this.linkForm.value.name ?? '',
        description: this.linkForm.value.description ?? '',
        url: this.linkForm.value.url ?? '',
        icon: this.linkForm.value.icon ?? '',
        category: this.data.link?.category?.id ?? null,
        tags: this.linkForm.value.tags ?? [],
        sortKey: this.data.link?.sortKey ?? '',
      },
    };

    this.dialogRef.close(dialogResult);
  }

  async onSearchIcon() {
    const url = this.linkForm.value.url ?? '';
    const faviconUrl = new URL('/favicon.ico', url).href;

    const exists = await checkFaviconExists(faviconUrl);

    if (exists) {
      this.linkForm.get('icon')?.setValue(faviconUrl);
      this.linkForm.get('icon')?.markAsDirty();
      this.snackbar.open('Successfully found favicon at url', 'Close', { duration: 3000 });
    } else {
      console.error('Favicon not found at', faviconUrl);
      this.linkForm.get('icon')?.reset();
      this.snackbar.open('Failed to find favicon at url', 'Close', { duration: 3000 });
    }
  }
}
