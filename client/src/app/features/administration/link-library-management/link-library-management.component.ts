import { Component, computed, inject, model, OnInit, signal } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';

import { CdkDrag, CdkDragDrop, CdkDropList, CdkDropListGroup } from '@angular/cdk/drag-drop';
import { filter, tap } from 'rxjs';
import { FormsModule } from '@angular/forms';

import { UserService } from '../../../core/services/user.service';
import { LinkLibraryManagementService } from './link-library-management.service';
import { ConfirmDialogComponent } from '../../../shared/dialogs/confirm-dialog/confirm-dialog.component';
import { LinkCategoryDialogComponent } from './link-category-dialog/link-category-dialog.component';
import { LinkLibraryManagementDialogComponent } from './link-library-management-dialog/link-library-management-dialog.component';
import { LinkLibraryImportDialogComponent } from './link-library-import-dialog/link-library-import-dialog.component';
import { LinkTagDialogComponent } from './link-tag-dialog/link-tag-dialog.component';
import { Category, Link, Tag } from './link-library-management';
import { USER_RIGHTS } from '../../../core/constants/user-rights.constant';
import { REBASE_REQUIRED } from '../../../core/constants/lexo-rank.constant';
import { generateSortKey } from '../../../core/utilities/lexo-rank.util';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../core/services/theme.service';
import { ImageFallbackDirective } from '../../../core/directives/image-fallback.directive';

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
    CommonModule,
    FormsModule,
    ImageFallbackDirective,
  ],
  templateUrl: './link-library-management.component.html',
  styleUrl: './link-library-management.component.scss',
})
export class LinkLibraryManagementComponent implements OnInit {
  private userService = inject(UserService);
  private themeService = inject(ThemeService);
  private linkLibraryManagementService = inject(LinkLibraryManagementService);
  private dialog = inject(MatDialog);

  readonly hasImportLibraryRight = signal<boolean>(this.userService.hasRights([USER_RIGHTS.IMPORT_LINK_LIBRARY]));

  // Link Information
  readonly links = this.linkLibraryManagementService.links;
  readonly linkCategories = this.linkLibraryManagementService.linkCategories;
  readonly linkTags = this.linkLibraryManagementService.linkTags;

  readonly linkCategoryMap = this.linkLibraryManagementService.linkCategoryMap;
  readonly unassignedLinks = this.linkLibraryManagementService.unassignedLinks;

  // Links
  readonly linkFilter = model<string>('');
  readonly linkFilteredIds = computed(() => this.getLinkFilteredSet(this.links(), this.linkFilter()));

  // Categories
  readonly categoryFilter = model<string>('');
  readonly filteredLinkCategories = computed(() => this.filterLinkCategories(this.linkCategories()));

  // Tags
  readonly tagFilter = model<string>('');
  readonly filteredLinkTags = computed(() => this.filterLinkTags(this.linkTags()));

  readonly isDarkTheme = this.themeService.isDarkTheme;

  ngOnInit() {
    this.linkLibraryManagementService.loadLinks();
    this.linkLibraryManagementService.loadCategories();
    this.linkLibraryManagementService.loadTags();
  }

  // *** Links ***
  onResetLinkFilter() {
    this.linkFilter.set('');
  }

  getLinkFilteredSet(links: Link[], linkFilter: string) {
    const filteredIds = new Set<number>();

    if (linkFilter) {
      const keywords = linkFilter

        .toLowerCase()
        .split(' ')
        .map((word) => word.trim())
        .filter(Boolean);

      for (const link of links) {
        const fields = [link.name, link.description];
        const matches = keywords.every((keyword) => fields.some((field) => field.toLowerCase().includes(keyword)));

        if (matches) {
          filteredIds.add(link.id);
        }
      }
    }

    return filteredIds;
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
    const title = 'Remove Link';
    const message = 'Are you sure you want to remove this link?';

    this.dialog
      .open(ConfirmDialogComponent, { data: { title, message }, panelClass: 'hz-dialog-container' })
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

    // Filter link out if moved within same category
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

    this.linkLibraryManagementService.updateLinkSort(curLink.id, curCategoryId, newSortKey);
  }
}
