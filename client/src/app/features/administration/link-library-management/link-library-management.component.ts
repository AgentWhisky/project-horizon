import { Component, effect, inject, OnInit, signal, viewChild } from '@angular/core';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';

import { MatDialog } from '@angular/material/dialog';
import { LinkLibraryManagementDialogComponent } from './link-library-management-dialog/link-library-management-dialog.component';
import { filter, tap } from 'rxjs';
import { LinkCategoryDialogComponent } from './link-category-dialog/link-category-dialog.component';
import { LinkTagDialogComponent } from './link-tag-dialog/link-tag-dialog.component';
import { LinkLibraryManagementService } from './link-library-management.service';
import { Category, Link, Tag } from './link-library-management';
import { MessageCardComponent } from '../../../shared/components/message-card/message-card.component';
import { LinkLibraryImportDialogComponent } from './link-library-import-dialog/link-library-import-dialog.component';
import { UserService } from '../../../core/services/user.service';
import { RemoveConfirmComponent } from '../../../shared/dialogs/remove-confirm/remove-confirm.component';
import { USER_RIGHTS } from '../../../core/constants/user-rights.constant';

@Component({
  selector: 'hz-link-library-management',
  imports: [
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatTabsModule,
    MatChipsModule,
    MessageCardComponent,
  ],
  templateUrl: './link-library-management.component.html',
  styleUrl: './link-library-management.component.scss',
})
export class LinkLibraryManagementComponent implements OnInit {
  private userService = inject(UserService);
  private linkLibraryManagementService = inject(LinkLibraryManagementService);
  private dialog = inject(MatDialog);

  readonly hasImportLibraryRight = signal<boolean>(this.userService.hasRights([USER_RIGHTS.IMPORT_LINK_LIBRARY]));

  // Link Table
  readonly linkSort = viewChild<MatSort>('linkSort');
  readonly linkPaginator = viewChild<MatPaginator>('linkPaginator');
  readonly linkDisplayedColumns: string[] = ['id', 'name', 'category', 'description', 'url', 'sortKey', 'tags', 'actions'];
  readonly linkDataSource = new MatTableDataSource<Link>();

  // Category Table
  readonly categorySort = viewChild<MatSort>('categorySort');
  readonly categoryPaginator = viewChild<MatPaginator>('categoryPaginator');
  readonly categoryDisplayedColumns: string[] = ['id', 'name', 'description', 'actions'];
  readonly categoryDataSource = new MatTableDataSource<Category>();

  // Tags Table
  readonly tagSort = viewChild<MatSort>('tagSort');
  readonly tagPaginator = viewChild<MatPaginator>('tagPaginator');
  readonly tagDisplayedColumns: string[] = ['id', 'name', 'actions'];
  readonly tagDataSource = new MatTableDataSource<Tag>();

  constructor() {
    // Link Table
    effect(() => {
      this.linkDataSource.data = this.linkLibraryManagementService.links();
    });

    effect(() => {
      this.linkDataSource.sort = this.linkSort() ?? null;
      this.linkDataSource.paginator = this.linkPaginator() ?? null;
      this.linkDataSource.sortingDataAccessor = (item, property) =>
        property === 'category' ? item.category.name : (item as any)[property];
    });

    // Category Table
    effect(() => {
      this.categoryDataSource.data = this.linkLibraryManagementService.linkCategories();
    });

    effect(() => {
      this.categoryDataSource.sort = this.categorySort() ?? null;
      this.categoryDataSource.paginator = this.categoryPaginator() ?? null;
    });

    // Tags Table
    effect(() => {
      this.tagDataSource.data = this.linkLibraryManagementService.linkTags();
    });

    effect(() => {
      this.tagDataSource.sort = this.tagSort() ?? null;
      this.tagDataSource.paginator = this.tagPaginator() ?? null;
    });
  }

  ngOnInit() {
    this.linkLibraryManagementService.loadLinks();
    this.linkLibraryManagementService.loadCategories();
    this.linkLibraryManagementService.loadTags();
  }

  // *** Links ***
  onCreateLink() {
    this.dialog
      .open(LinkLibraryManagementDialogComponent, {
        data: { type: 'create' },
        width: '560px',
        panelClass: 'hz-dialog-container',
      })
      .afterClosed()
      .pipe(
        filter((result) => result && result.status === true),
        tap((result) => this.linkLibraryManagementService.addLink(result.linkData))
      )
      .subscribe();
  }

  onEditLink(link: Link) {
    this.dialog
      .open(LinkLibraryManagementDialogComponent, {
        data: { type: 'update', link },
        width: '560px',
        panelClass: 'hz-dialog-container',
      })
      .afterClosed()
      .pipe(
        filter((result) => result && result.status === true),
        tap((result) => this.linkLibraryManagementService.updateLink(link.id, result.linkData))
      )
      .subscribe();
  }

  onDeleteLink(link: Link) {
    const message = 'Are you sure you want to remove this link?';

    this.dialog
      .open(RemoveConfirmComponent, { data: { message }, panelClass: 'hz-dialog-container' })
      .afterClosed()
      .pipe(
        filter((result) => result),
        tap(() => this.linkLibraryManagementService.removeLink(link.id))
      )
      .subscribe();
  }

  // *** Categories ***
  onCreateCategory() {
    this.dialog
      .open(LinkCategoryDialogComponent, {
        data: { type: 'create' },
        height: '440px',
        width: '560px',
        panelClass: 'hz-dialog-container',
      })
      .afterClosed()
      .pipe(
        filter((result) => result && result.status === true),
        tap((result) => this.linkLibraryManagementService.addCategory(result.category))
      )
      .subscribe();
  }

  onEditCategory(category: Category) {
    this.dialog
      .open(LinkCategoryDialogComponent, {
        data: { type: 'update', category },
        height: '440px',
        width: '560px',
        panelClass: 'hz-dialog-container',
      })
      .afterClosed()
      .pipe(
        filter((result) => result && result.status === true),
        tap((result) =>
          this.linkLibraryManagementService.updateCategory(category.id, {
            name: result.category.name,
            description: result.category.description,
          })
        )
      )
      .subscribe();
  }

  onDeleteCategory(category: Category) {
    const message = 'Are you sure you want to remove this category?';

    this.dialog
      .open(RemoveConfirmComponent, { data: { message }, panelClass: 'hz-dialog-container' })
      .afterClosed()
      .pipe(
        filter((result) => result),
        tap(() => this.linkLibraryManagementService.removeCategory(category.id))
      )
      .subscribe();
  }

  // *** Tags ***
  onCreateTag() {
    this.dialog
      .open(LinkTagDialogComponent, {
        data: { type: 'create' },
        height: '220px',
        width: '560px',
        panelClass: 'hz-dialog-container',
      })
      .afterClosed()
      .pipe(
        filter((result) => result && result.status === true),
        tap((result) => this.linkLibraryManagementService.addTag(result.tag))
      )
      .subscribe();
  }

  onEditTag(tag: Tag) {
    this.dialog
      .open(LinkTagDialogComponent, {
        data: { type: 'update', tag },
        height: '220px',
        width: '560px',
        panelClass: 'hz-dialog-container',
      })
      .afterClosed()
      .pipe(
        filter((result) => result && result.status === true),
        tap((result) => this.linkLibraryManagementService.updateTag(tag.id, result.tag))
      )
      .subscribe();
  }

  onDeleteTag(tag: Tag) {
    const message = 'Are you sure you want to remove this tag?';

    this.dialog
      .open(RemoveConfirmComponent, { data: { message }, panelClass: 'hz-dialog-container' })
      .afterClosed()
      .pipe(
        filter((result) => result),
        tap(() => this.linkLibraryManagementService.removeTag(tag.id))
      )
      .subscribe();
  }

  onImportLinkLibrary() {
    this.dialog
      .open(LinkLibraryImportDialogComponent, {
        width: '560px',
        panelClass: 'hz-dialog-container',
      })
      .afterClosed()
      .pipe(
        filter((result) => result && result.status === true),
        tap((result) => this.linkLibraryManagementService.importLinkLibrary(result.file))
      )
      .subscribe();
  }

  onExportLinkLibrary() {
    this.linkLibraryManagementService.exportLinkLibrary();
  }
}
