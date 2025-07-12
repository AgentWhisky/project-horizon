import { Component, computed, effect, inject, model, OnInit, signal, viewChild } from '@angular/core';

import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { filter, tap } from 'rxjs';

import { UserService } from '../../../core/services/user.service';
import { MessageCardComponent } from '../../../shared/components/message-card/message-card.component';
import { RemoveConfirmComponent } from '../../../shared/dialogs/remove-confirm/remove-confirm.component';
import { ConfirmDialogComponent } from '../../../shared/dialogs/confirm-dialog/confirm-dialog.component';
import { USER_RIGHTS } from '../../../core/constants/user-rights.constant';

import { LinkLibraryManagementService } from './link-library-management.service';
import { LinkLibraryManagementDialogComponent } from './link-library-management-dialog/link-library-management-dialog.component';
import { LinkCategoryDialogComponent } from './link-category-dialog/link-category-dialog.component';
import { LinkTagDialogComponent } from './link-tag-dialog/link-tag-dialog.component';
import { LinkLibraryImportDialogComponent } from './link-library-import-dialog/link-library-import-dialog.component';
import { Category, Link, Tag } from './link-library-management';
import { MatDividerModule } from '@angular/material/divider';
import { CdkDrag, CdkDragDrop, CdkDropList, CdkDropListGroup } from '@angular/cdk/drag-drop';
import { generateSortKey } from '../../../core/utilities/lexo-rank.util';
import { REBASE_REQUIRED } from '../../../core/constants/lexo-rank.constant';

@Component({
  selector: 'hz-link-library-management',
  imports: [
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatTabsModule,
    MatChipsModule,
    MatDividerModule,
    CdkDropList,
    CdkDrag,
    CdkDropListGroup,
    FormsModule,
  ],
  templateUrl: './link-library-management.component.html',
  styleUrl: './link-library-management.component.scss',
})
export class LinkLibraryManagementComponent implements OnInit {
  private userService = inject(UserService);
  private linkLibraryManagementService = inject(LinkLibraryManagementService);
  private dialog = inject(MatDialog);

  readonly hasImportLibraryRight = signal<boolean>(this.userService.hasRights([USER_RIGHTS.IMPORT_LINK_LIBRARY]));

  // Link Information
  readonly links = this.linkLibraryManagementService.links;
  readonly linkCategories = this.linkLibraryManagementService.linkCategories;
  readonly linkTags = this.linkLibraryManagementService.linkTags;

  // Links
  readonly linkCategoryMap = computed(() => this.getLinkCategoryMap(this.links(), this.linkCategories()));
  readonly unassignedLinks = computed(() => this.getUnassignedLinks(this.links()));

  // Categories
  readonly categoryFilter = model<string>('');
  readonly filteredLinkCategories = computed(() => this.filterLinkCategories(this.linkCategories()));

  // Tags
  readonly tagFilter = model<string>('');
  readonly filteredLinkTags = computed(() => this.filterLinkTags(this.linkTags()));

  constructor() {}

  ngOnInit() {
    this.linkLibraryManagementService.loadLinks();
    this.linkLibraryManagementService.loadCategories();
    this.linkLibraryManagementService.loadTags();
  }

  // *** Links ***
  getLinkCategoryMap(links: Link[], categories: Category[]) {
    const categoryMap: { [categoryId: number]: Link[] } = {};

    for (const category of categories) {
      const sortedLinks = links.filter((link) => link.category?.id === category.id).sort((a, b) => a.sortKey.localeCompare(b.sortKey));

      categoryMap[category.id] = sortedLinks;
    }

    return categoryMap;
  }

  getUnassignedLinks(links: Link[]) {
    return links.filter((link) => link.category === null);
  }

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
  onResetCategoryFilter() {
    this.categoryFilter.set('');
  }

  filterLinkCategories(categories: Category[]) {
    const categoryFilter = this.categoryFilter();

    if (!categoryFilter) {
      return categories;
    }

    const keywords = categoryFilter
      .toLowerCase()
      .split(' ')
      .map((word) => word.trim())
      .filter(Boolean);

    return categories.filter((category) =>
      keywords.every((keyword) => [category.name, category.description].some((field) => field.toLowerCase().includes(keyword)))
    );
  }

  onCreateCategory() {
    this.dialog
      .open(LinkCategoryDialogComponent, {
        data: { type: 'create' },
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
    const title = 'Remove Category';
    const message = 'Are you sure you want to remove this category?';

    this.dialog
      .open(ConfirmDialogComponent, { data: { title, message }, panelClass: 'hz-dialog-container' })
      .afterClosed()
      .pipe(
        filter((result) => result),
        tap(() => this.linkLibraryManagementService.removeCategory(category.id))
      )
      .subscribe();
  }

  // *** LINK TAGS ***
  onResetTagFilter() {
    this.tagFilter.set('');
  }

  filterLinkTags(tags: Tag[]) {
    const tagFilter = this.tagFilter();

    if (!tagFilter) {
      return tags;
    }

    const keywords = tagFilter
      .toLowerCase()
      .split(' ')
      .map((word) => word.trim())
      .filter(Boolean);

    return tags.filter((tag) => keywords.every((keyword) => tag.name.toLowerCase().includes(keyword)));
  }

  onCreateTag() {
    this.dialog
      .open(LinkTagDialogComponent, {
        data: { type: 'create' },
        panelClass: 'hz-dialog-container',
      })
      .afterClosed()
      .pipe(
        filter((result) => result && result.status),
        tap((result) => this.linkLibraryManagementService.addTag(result.tag))
      )
      .subscribe();
  }

  onEditTag(tag: Tag) {
    this.dialog
      .open(LinkTagDialogComponent, {
        data: { type: 'update', tag },
        panelClass: 'hz-dialog-container',
      })
      .afterClosed()
      .pipe(
        filter((result) => result && result.status),
        tap((result) => this.linkLibraryManagementService.updateTag(tag.id, result.tag))
      )
      .subscribe();
  }

  onDeleteTag(tag: Tag) {
    const title = 'Remove Tag';
    const message = 'Are you sure you want to remove this tag?';

    this.dialog
      .open(ConfirmDialogComponent, { data: { title, message }, panelClass: 'hz-dialog-container' })
      .afterClosed()
      .pipe(
        filter((result) => result),
        tap(() => this.linkLibraryManagementService.removeTag(tag.id))
      )
      .subscribe();
  }

  // *** IMPORT/EXPORT FUNCTIONS ***
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

  // *** CDK DRAG & DROP ***
  onDrop(event: CdkDragDrop<Link[]>) {
    const prevContainer = event.previousContainer;
    const prevIndex = event.previousIndex;
    const curContainer = event.container;
    const curIndex = event.currentIndex;

    // Ignore drag to same position
    if (prevContainer.id === curContainer.id && prevIndex === curIndex) {
      return;
    }

    const prevCategoryId = parseInt(prevContainer.id.replace('category-drop-', ''));
    const curCategoryId = parseInt(curContainer.id.replace('category-drop-', ''));

    let links = curCategoryId === 0 ? this.unassignedLinks() : this.linkCategoryMap()[curCategoryId];
    const curLink = prevCategoryId === 0 ? this.unassignedLinks()[prevIndex] : this.linkCategoryMap()[prevCategoryId][prevIndex];

    if (prevCategoryId === curCategoryId) {
      links = links.filter((link) => link.id !== curLink.id);
    }

    const prevKey = links[curIndex - 1]?.sortKey ?? null;
    const nextKey = links[curIndex]?.sortKey ?? null;

    let newSortKey = generateSortKey(prevKey, nextKey, curCategoryId.toString());

    // Check if rebase is required and run if necessary
    if (newSortKey === REBASE_REQUIRED) {
      this.linkLibraryManagementService.rebaseLinks();

      newSortKey = generateSortKey(prevKey, nextKey, curCategoryId.toString());
    }

    console.log(newSortKey);

    this.linkLibraryManagementService.updateLinkSort(curLink.id, curCategoryId, newSortKey);
  }
}
