import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Link, LinkPayload } from '../link-library-management';
import { LinkLibraryManagementService } from '../link-library-management.service';
import { ValidatorMessagePipe } from '../../../../pipes/validator-message.pipe';
import { URL_REGEX } from '../../../../constants';

interface DialogData {
  type: 'create' | 'update';
  link?: Link;
}

interface DialogResult {
  status: boolean;
  linkData: LinkPayload;
}

@Component({
  selector: 'app-link-library-management-dialog',
  imports: [MatButtonModule, MatInputModule, MatSelectModule, MatDialogModule, ReactiveFormsModule, ValidatorMessagePipe],
  templateUrl: './link-library-management-dialog.component.html',
  styleUrl: './link-library-management-dialog.component.scss',
})
export class LinkLibraryManagementDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
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
        thumbnail: link.thumbnail,
        category: link.category.id,
        tags: link.tags?.map((tag) => tag.id) ?? [],
      });
    }
  }

  getNewLinkForm() {
    return this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(30)]],
      description: ['', [Validators.required, Validators.maxLength(250)]],
      url: ['', [Validators.required, Validators.maxLength(2048), Validators.pattern(URL_REGEX)]],
      thumbnail: ['', [Validators.maxLength(2048), Validators.pattern(URL_REGEX)]],
      category: [null as unknown as number, [Validators.required]],
      tags: [[] as number[]],
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
