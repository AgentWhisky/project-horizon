import { Component, effect, OnInit, viewChild } from '@angular/core';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';

import { LinkLibraryService } from '../../../services/link-library.service';
import { Link, LinkCategoryCode, LinkTag, LinkTagCode } from '../../../types/link-library';
import { MatDialog } from '@angular/material/dialog';
import { LinkLibraryManagementDialogComponent } from './link-library-management-dialog/link-library-management-dialog.component';
import { filter, tap } from 'rxjs';
import { RemoveConfirmComponent } from '../../../dialogs/remove-confirm/remove-confirm.component';
import { LinkCategoryDialogComponent } from './link-category-dialog/link-category-dialog.component';
import { LinkTagDialogComponent } from './link-tag-dialog/link-tag-dialog.component';

@Component({
  selector: 'app-link-library-management',
  imports: [MatTableModule, MatSortModule, MatPaginatorModule, MatButtonModule, MatIconModule, MatTooltipModule, MatTabsModule],
  templateUrl: './link-library-management.component.html',
  styleUrl: './link-library-management.component.scss',
})
export class LinkLibraryManagementComponent implements OnInit {
  // Link Table
  readonly linkSort = viewChild<MatSort>('linkSort');
  readonly linkPaginator = viewChild<MatPaginator>('linkPaginator');
  readonly linkDisplayedColumns: string[] = ['id', 'name', 'category', 'description', 'url', 'tags', 'actions'];
  readonly linkDataSource = new MatTableDataSource<Link>();

  // Category Table
  readonly categorySort = viewChild<MatSort>('categorySort');
  readonly categoryPaginator = viewChild<MatPaginator>('categoryPaginator');
  readonly categoryDisplayedColumns: string[] = ['id', 'name', 'description', 'actions'];
  readonly categoryDataSource = new MatTableDataSource<LinkCategoryCode>();

  // Tags Table
  readonly tagSort = viewChild<MatSort>('tagSort');
  readonly tagPaginator = viewChild<MatPaginator>('tagPaginator');
  readonly tagDisplayedColumns: string[] = ['id', 'name', 'actions'];
  readonly tagDataSource = new MatTableDataSource<LinkTagCode>();

  constructor(private linkLibraryService: LinkLibraryService, private dialog: MatDialog) {
    // Link Table
    effect(() => {
      this.linkDataSource.data = this.linkLibraryService.links();
    });

    effect(() => {
      this.linkDataSource.sort = this.linkSort() ?? null;
      this.linkDataSource.paginator = this.linkPaginator() ?? null;
    });

    // Category Table
    effect(() => {
      this.categoryDataSource.data = this.linkLibraryService.linkCategories();
    });

    effect(() => {
      this.categoryDataSource.sort = this.categorySort() ?? null;
      this.categoryDataSource.paginator = this.categoryPaginator() ?? null;
    });

    // Tags Table
    effect(() => {
      this.tagDataSource.data = this.linkLibraryService.linkTags();
    });

    effect(() => {
      this.tagDataSource.sort = this.tagSort() ?? null;
      this.tagDataSource.paginator = this.tagPaginator() ?? null;
    });
  }

  ngOnInit() {
    this.linkLibraryService.loadLibraryLinks();
    this.linkLibraryService.loadLinkCategories();
    this.linkLibraryService.loadLinkTags();
  }

  // *** Links ***
  onCreateLink() {
    this.dialog
      .open(LinkLibraryManagementDialogComponent, {
        data: { type: 'create' },
        height: '800px',
        width: '560px',
      })
      .afterClosed()
      .pipe(
        filter((result) => result && result.status === true),
        tap((result) => this.linkLibraryService.addLink(result.linkData))
      )
      .subscribe();
  }

  onEditLink(link: Link) {
    this.dialog
      .open(LinkLibraryManagementDialogComponent, {
        data: { type: 'update', link },
        height: '800px',
        width: '560px',
      })
      .afterClosed()
      .pipe(
        filter((result) => result && result.status === true),
        tap((result) => this.linkLibraryService.updateLink({ id: link.id, ...result.linkData }))
      )
      .subscribe();
  }

  onDeleteLink(link: Link) {
    const message = 'Are you sure you want to remove this link?';

    this.dialog
      .open(RemoveConfirmComponent, { data: { message } })
      .afterClosed()
      .pipe(
        filter((result) => result),
        tap(() => this.linkLibraryService.removeLink(link.id))
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
      })
      .afterClosed()
      .pipe(
        filter((result) => result && result.status === true),
        tap((result) => this.linkLibraryService.addLinkCategory(result.category))
      )
      .subscribe();
  }

  onEditCategory(category: LinkCategoryCode) {
    this.dialog
      .open(LinkCategoryDialogComponent, {
        data: { type: 'update', category },
        height: '440px',
        width: '560px',
      })
      .afterClosed()
      .pipe(
        filter((result) => result && result.status === true),
        tap((result) => this.linkLibraryService.updateLinkCategory({ id: category.id, ...result.category }))
      )
      .subscribe();
  }

  onDeleteCategory(category: LinkCategoryCode) {
    const message = 'Are you sure you want to remove this category?';

    this.dialog
      .open(RemoveConfirmComponent, { data: { message } })
      .afterClosed()
      .pipe(
        filter((result) => result),
        tap(() => this.linkLibraryService.removeLinkCategory(category.id))
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
      })
      .afterClosed()
      .pipe(
        filter((result) => result && result.status === true),
        tap((result) => this.linkLibraryService.addLinkTag(result.tag))
      )
      .subscribe();
  }

  onEditTag(tag: LinkTagCode) {
    this.dialog
      .open(LinkTagDialogComponent, {
        data: { type: 'update', tag },
        height: '220px',
        width: '560px',
      })
      .afterClosed()
      .pipe(
        filter((result) => result && result.status === true),
        tap((result) => this.linkLibraryService.updateLinkTag({ id: tag.id, ...result.tag }))
      )
      .subscribe();
  }

  onDeleteTag(tag: LinkTagCode) {
    const message = 'Are you sure you want to remove this tag?';

    this.dialog
      .open(RemoveConfirmComponent, { data: { message } })
      .afterClosed()
      .pipe(
        filter((result) => result),
        tap(() => this.linkLibraryService.removeLinkTag(tag.id))
      )
      .subscribe();
  }

  // *** Formatting Function ***
  getTagsFormatted(linkTags: LinkTag[]) {
    return linkTags.map((tag) => tag.name).join(', ');
  }
}
