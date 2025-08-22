import { Component, inject, OnInit, signal } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { ValidatorMessagePipe } from '../../../../core/pipes/validator-message.pipe';
import { checkFaviconExists } from '../../../../core/utilities/favicon.util';
import { LinkLibraryManagementService } from '../link-library-management.service';
import { Link, LinkPayload } from '../link-library-management';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../../core/services/theme.service';
import { tap } from 'rxjs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ImageFallbackDirective } from '../../../../core/directives/image-fallback.directive';
import { REGEX } from '@hz/constants';

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
    MatButtonToggleModule,
    MatTooltipModule,
    CommonModule,
    ReactiveFormsModule,
    ValidatorMessagePipe,
    ImageFallbackDirective,
  ],
  templateUrl: './link-library-management-dialog.component.html',
  styleUrl: './link-library-management-dialog.component.scss',
})
export class LinkLibraryManagementDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private snackbar = inject(MatSnackBar);
  private themeService = inject(ThemeService);
  private linkLibraryManagementService = inject(LinkLibraryManagementService);

  private dialogRef = inject(MatDialogRef<LinkLibraryManagementDialogComponent>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  readonly isDarkTheme = this.themeService.isDarkTheme;

  readonly linkCategories = this.linkLibraryManagementService.linkCategories;
  readonly linkTags = this.linkLibraryManagementService.linkTags;

  readonly linkForm = this.getNewLinkForm();

  readonly showIconDisplay = signal<boolean>(false);
  readonly showIconContrastBackground = signal<boolean>(false);

  ngOnInit() {
    /** Only show Mat Form Field subscript section when text is empty */
    this.linkForm
      .get('icon')!
      .valueChanges.pipe(tap((value) => this.showIconDisplay.set(REGEX.URL.test(value ?? ''))))
      .subscribe();

    this.linkForm
      .get('contrastBackground')!
      .valueChanges.pipe(
        tap((value) => this.showIconContrastBackground.set((value === 1 && this.isDarkTheme()) || (value === 2 && !this.isDarkTheme())))
      )
      .subscribe();

    if (this.data.type === 'update' && this.data.link) {
      const link = this.data.link;

      this.linkForm.patchValue({
        name: link.name,
        description: link.description,
        url: link.url,
        icon: link.icon,
        tags: link.tags?.map((tag) => tag.id) ?? [],
        contrastBackground: link.contrastBackground,
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
      contrastBackground: [0, Validators.required],
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
        contrastBackground: this.linkForm.value.contrastBackground ?? 0,
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
