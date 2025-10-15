import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, filter, firstValueFrom, of, tap } from 'rxjs';

import { MatSnackBar } from '@angular/material/snack-bar';

import { DeleteResponse, OperationResult } from '@hz/core/models';
import { TokenService, DownloadService } from '@hz/core/services';
import { SNACKBAR_INTERVAL } from '@hz/core/constants';

import { Category, CategoryPayload, Link, LinkPayload, Tag, TagPayload } from './resources/link-library-management.model';
import { extractFilenameFromContentDisposition, HzLoadingState } from '@hz/core/utilities';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class LinkLibraryManagementService {
  private tokenService = inject(TokenService);
  private downloadService = inject(DownloadService);
  private snackbar = inject(MatSnackBar);

  private readonly _links = signal<Link[]>([]);
  readonly links = this._links.asReadonly();
  readonly linksLoadingState = new HzLoadingState('Link Library Management Links');

  private readonly _linkCategories = signal<Category[]>([]);
  readonly linkCategories = this._linkCategories.asReadonly();
  readonly linkCategoriesLoadingState = new HzLoadingState('Link Library Management Categories');
  readonly linkCategoryList = computed(() => this._linkCategories().map((item) => item.name));

  private readonly _linkTags = signal<Tag[]>([]);
  readonly linkTags = this._linkTags.asReadonly();
  readonly linkTagsLoadingState = new HzLoadingState('Link Library Management Tags');
  readonly linkTagList = computed(() => this._linkTags().map((item) => item.name));

  readonly linkCategoryMap = computed(() => this.getLinkCategoryMap(this._links(), this._linkCategories()));
  readonly unassignedLinks = computed(() => this.getUnassignedLinks(this._links()));

  reset() {
    this.resetLinks();
    this.resetCategories();
    this.resetTags();
  }

  /** LINK FUNCTIONS */
  loadLinks() {
    if (this.linksLoadingState.isLoading()) {
      return;
    }

    this.linksLoadingState.setInProgress();

    this.tokenService
      .getWithTokenRefresh<Link[]>('/link-library-management/links')
      .pipe(
        tap((links: Link[]) => {
          this._links.set(links);
          this.linksLoadingState.setSuccess();
        }),
        catchError((err: HttpErrorResponse) => {
          this.linksLoadingState.setFailed(err.status);
          console.error(`Failed to fetch Link Library Mangement links`, { error: err });
          return of(null);
        })
      )
      .subscribe();
  }

  resetLinks() {
    this._links.set([]);
    this.linksLoadingState.reset();
  }

  addLink(linkPayload: LinkPayload) {
    this.tokenService
      .postWithTokenRefresh<Link>('/link-library-management/links', linkPayload)
      .pipe(
        tap((link: Link) => {
          this._links.set([...this._links(), link]);
          this.snackbar.open('Successfully added link', 'Close', { duration: SNACKBAR_INTERVAL.NORMAL });
        }),
        catchError((err: HttpErrorResponse) => {
          this.snackbar.open('Failed to add link', 'Close', { duration: SNACKBAR_INTERVAL.NORMAL });
          console.error(`Failed to add Link Library link`, { error: err });
          return of(null);
        })
      )
      .subscribe();
  }

  updateLink(id: number, linkPayload: LinkPayload) {
    this.tokenService
      .putWithTokenRefresh<Link>(`/link-library-management/links/${id}`, linkPayload)
      .pipe(
        tap((updatedLink: Link) => {
          const updatedIndex = this._links().findIndex((item) => item.id === id);

          const updatedLinks: Link[] = [...this._links().filter((item) => item.id !== id)];
          updatedLinks.splice(updatedIndex, 0, updatedLink);

          this._links.set(updatedLinks);
          this.snackbar.open('Successfully updated link', 'Close', { duration: SNACKBAR_INTERVAL.NORMAL });
        }),
        catchError((err: HttpErrorResponse) => {
          this.snackbar.open('Failed to update link', 'Close', { duration: SNACKBAR_INTERVAL.NORMAL });
          console.error(`Failed to update Link Library link`, { id, error: err });
          return of(null);
        })
      )
      .subscribe();
  }

  removeLink(id: number) {
    this.tokenService
      .deleteWithTokenRefresh<DeleteResponse>(`/link-library-management/links/${id}`)
      .pipe(
        filter((deleteResponse: DeleteResponse) => deleteResponse.success),
        tap((deleteResponse: DeleteResponse) => {
          this._links.set([...this._links().filter((item) => item.id !== deleteResponse.id)]);
          this.snackbar.open('Successfully removed link', 'Close', { duration: SNACKBAR_INTERVAL.NORMAL });
        }),
        catchError((err: HttpErrorResponse) => {
          this.snackbar.open('Failed to remove link', 'Close', { duration: SNACKBAR_INTERVAL.NORMAL });
          console.error(`Failed to remove Link Library link`, { id, error: err });
          return of(null);
        })
      )
      .subscribe();
  }

  updateLinkSort(id: number, categoryId: number, sortKey: string) {
    // Clone existing links
    const oldLinks = structuredClone(this._links());

    // Update locally before sending to server, preventing drag delay
    const updatedIndex = this._links().findIndex((item) => item.id === id);
    const updatedLink = structuredClone(this._links()[updatedIndex]);

    updatedLink.sortKey = sortKey;

    const normalizedCategoryId = categoryId === 0 ? null : categoryId;
    const newCategory = this._linkCategories().find((cat) => cat.id === normalizedCategoryId);
    updatedLink.category = newCategory ? { id: newCategory.id, name: newCategory.name, description: newCategory.description } : null;

    const updatedLinks = [...this._links()];
    updatedLinks[updatedIndex] = updatedLink;
    this._links.set(updatedLinks);

    const linkPayload = {
      sortKey: updatedLink.sortKey,
      category: normalizedCategoryId,
    };

    this.tokenService
      .putWithTokenRefresh<Link>(`/link-library-management/links/${id}/sortKey`, linkPayload)
      .pipe(
        catchError((err: HttpErrorResponse) => {
          this.snackbar.open('Failed to update link sort key', 'Close', { duration: SNACKBAR_INTERVAL.NORMAL });
          console.error(`Failed to update Link Library link sort key`, { id, error: err });

          this._links.set(oldLinks); // Revert to pre-sortkey change
          return of(null);
        })
      )
      .subscribe();
  }

  rebaseLinks() {
    this.tokenService
      .postWithTokenRefresh<OperationResult>(`/link-library-management/links/rebase`, {})
      .pipe(
        tap(() => {
          this.snackbar.open('Successfully rebased links', 'Close', { duration: SNACKBAR_INTERVAL.NORMAL });
        }),
        catchError((err: HttpErrorResponse) => {
          this.snackbar.open('Failed to rebase links', 'Close', { duration: SNACKBAR_INTERVAL.NORMAL });
          console.error(`Failed to rebase Link Library links`, { error: err });
          return of(null);
        })
      )
      .subscribe();
  }

  /** CATEGORY FUNCTIONS */
  loadCategories() {
    if (this.linkCategoriesLoadingState.isLoading()) {
      return;
    }

    this.linkCategoriesLoadingState.setInProgress();

    this.tokenService
      .getWithTokenRefresh<Category[]>('/link-library-management/categories')
      .pipe(
        tap((categories: Category[]) => {
          this._linkCategories.set(categories);
          this.linkCategoriesLoadingState.setSuccess();
        }),
        catchError((err: HttpErrorResponse) => {
          this.linkCategoriesLoadingState.setFailed(err.status);
          console.error(`Failed to fetch Link Library categories`, { error: err });
          return of(null);
        })
      )
      .subscribe();
  }

  resetCategories() {
    this._linkCategories.set([]);
    this.linkCategoriesLoadingState.reset();
  }

  addCategory(categoryPayload: CategoryPayload) {
    this.tokenService
      .postWithTokenRefresh<Category>('/link-library-management/categories', categoryPayload)
      .pipe(
        tap((category: Category) => {
          this._linkCategories.set([...this._linkCategories(), category]);
          this.snackbar.open('Successfully added category', 'Close', { duration: SNACKBAR_INTERVAL.NORMAL });
        }),
        catchError((err: HttpErrorResponse) => {
          this.snackbar.open('Failed to add category', 'Close', { duration: SNACKBAR_INTERVAL.NORMAL });
          console.error(`Failed to add Link Library category`, { error: err });
          return of(null);
        })
      )
      .subscribe();
  }

  updateCategory(id: number, categoryPayload: CategoryPayload) {
    this.tokenService
      .putWithTokenRefresh<Category>(`/link-library-management/categories/${id}`, categoryPayload)
      .pipe(
        tap((updatedCategory: Category) => {
          const updatedIndex = this._linkCategories().findIndex((item) => item.id === id);

          const updatedCategories: Category[] = [...this._linkCategories().filter((item) => item.id !== id)];
          updatedCategories.splice(updatedIndex, 0, updatedCategory);

          this._linkCategories.set(updatedCategories);
          this.snackbar.open('Successfully updated category', 'Close', { duration: SNACKBAR_INTERVAL.NORMAL });
        }),
        catchError((err: HttpErrorResponse) => {
          this.snackbar.open('Failed to update category', 'Close', { duration: SNACKBAR_INTERVAL.NORMAL });
          console.error(`Failed to update Link Library category`, { error: err });
          return of(null);
        })
      )
      .subscribe();
  }

  removeCategory(id: number) {
    this.tokenService
      .deleteWithTokenRefresh<DeleteResponse>(`/link-library-management/categories/${id}`)
      .pipe(
        filter((deleteResponse: DeleteResponse) => deleteResponse.success),
        tap((deleteResponse: DeleteResponse) => {
          this._linkCategories.set([...this.linkCategories().filter((item) => item.id !== deleteResponse.id)]);
          this.snackbar.open('Successfully removed category', 'Close', { duration: SNACKBAR_INTERVAL.NORMAL });
        }),
        catchError((err: HttpErrorResponse) => {
          this.snackbar.open('Failed to remove category', 'Close', { duration: SNACKBAR_INTERVAL.NORMAL });
          console.error(`Failed to remove Link Library category`, { id, error: err });
          return of(null);
        })
      )
      .subscribe();
  }

  // *** TAG FUNCTIONS ***
  loadTags() {
    if (this.linkTagsLoadingState.isLoading()) {
      return;
    }

    this.linkTagsLoadingState.setInProgress();

    this.tokenService
      .getWithTokenRefresh<Tag[]>('/link-library-management/tags')
      .pipe(
        tap((tags: Tag[]) => {
          this._linkTags.set(tags);
          this.linkTagsLoadingState.setSuccess();
        }),
        catchError((err: HttpErrorResponse) => {
          this.linkTagsLoadingState.setFailed(err.status);
          console.error(`Failed to fetch Link Library Mangement tags`, { error: err });
          return of(null);
        })
      )
      .subscribe();
  }

  resetTags() {
    this._linkTags.set([]);
    this.linkTagsLoadingState.reset();
  }

  addTag(tagPayload: TagPayload) {
    this.tokenService
      .postWithTokenRefresh<Tag>('/link-library-management/tags', tagPayload)
      .pipe(
        tap((tag: Tag) => {
          this._linkTags.set([...this._linkTags(), tag]);
          this.snackbar.open('Successfully added tag', 'Close', { duration: SNACKBAR_INTERVAL.NORMAL });
        }),
        catchError((err: HttpErrorResponse) => {
          this.snackbar.open('Failed to add link tag', 'Close', { duration: SNACKBAR_INTERVAL.NORMAL });
          console.error(`Failed to add Link Library link tag`, { error: err });
          return of(null);
        })
      )
      .subscribe();
  }

  updateTag(id: number, tagPayload: TagPayload) {
    this.tokenService
      .putWithTokenRefresh<Tag>(`/link-library-management/tags/${id}`, tagPayload)
      .pipe(
        tap((updatedTag: Tag) => {
          const updatedIndex = this._linkTags().findIndex((item) => item.id === id);

          const updatedTags: Tag[] = [...this._linkTags().filter((item) => item.id !== id)];
          updatedTags.splice(updatedIndex, 0, updatedTag);

          this._linkTags.set(updatedTags);
          this.snackbar.open('Successfully updated tag', 'Close', { duration: SNACKBAR_INTERVAL.NORMAL });
        }),
        catchError((err: HttpErrorResponse) => {
          this.snackbar.open('Failed to update tag', 'Close', { duration: SNACKBAR_INTERVAL.NORMAL });
          console.error(`Failed to update Link Library link tag`, { id, error: err });
          return of(null);
        })
      )
      .subscribe();
  }

  removeTag(id: number) {
    this.tokenService
      .deleteWithTokenRefresh<DeleteResponse>(`/link-library-management/tags/${id}`)
      .pipe(
        filter((deleteResponse: DeleteResponse) => deleteResponse.success),
        tap((deleteResponse: DeleteResponse) => {
          this._linkTags.set([...this.linkTags().filter((item) => item.id !== deleteResponse.id)]);
          this.snackbar.open('Successfully removed tag', 'Close', { duration: SNACKBAR_INTERVAL.NORMAL });
        }),
        catchError((err: HttpErrorResponse) => {
          this.snackbar.open('Failed to remove tag', 'Close', { duration: SNACKBAR_INTERVAL.NORMAL });
          console.error(`Failed to remove Link Library link tag`, { id, error: err });
          return of(null);
        })
      )
      .subscribe();
  }

  /** LINK LIBRARY IMPORT/EXPORT FUNCTIONS */
  importLinkLibrary(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    this.tokenService
      .postWithTokenRefresh('/link-library-management/import', formData)
      .pipe(
        tap(() => {
          this.snackbar.open('Successfully imported Link Library', 'Close', { duration: SNACKBAR_INTERVAL.NORMAL });
        }),
        catchError((err: HttpErrorResponse) => {
          this.snackbar.open('Failed to import Link Library', 'Close', { duration: SNACKBAR_INTERVAL.NORMAL });
          console.error(`Failed to import Link Library`, { error: err });
          return of(null);
        })
      )
      .subscribe();
  }

  exportLinkLibrary() {
    this.tokenService
      .getWithTokenRefresh<HttpResponse<Blob>>(`/link-library-management/export`, {
        responseType: 'blob',
        observe: 'response',
      })
      .pipe(
        tap((response: HttpResponse<Blob>) => {
          const blob = response.body;
          const contentDisposition = response.headers.get('Content-Disposition');

          const filename = extractFilenameFromContentDisposition(contentDisposition, 'LinkLibraryExport.json');

          if (!blob) {
            this.snackbar.open('No data returned in exported file', 'Close', { duration: SNACKBAR_INTERVAL.NORMAL });
            return;
          }

          this.downloadService.downloadFile(blob, filename);
          this.snackbar.open('Successfully exported Link Library', 'Close', { duration: SNACKBAR_INTERVAL.NORMAL });
        }),
        catchError((err: HttpErrorResponse) => {
          this.snackbar.open('Failed to export Link Library', 'Close', { duration: SNACKBAR_INTERVAL.NORMAL });
          console.error(`Failed to export Link Library`, { error: err });
          return of(null);
        })
      )
      .subscribe();
  }

  /** PRIVATE LINK FUNCTIONS */
  private getLinkCategoryMap(links: Link[], categories: Category[]) {
    const categoryMap: { [categoryId: number]: Link[] } = {};

    for (const category of categories) {
      const sortedLinks = links.filter((link) => link.category?.id === category.id).sort((a, b) => a.sortKey.localeCompare(b.sortKey));

      categoryMap[category.id] = sortedLinks;
    }

    return categoryMap;
  }

  private getUnassignedLinks(links: Link[]) {
    return links.filter((link) => link.category === null).sort((a, b) => a.sortKey.localeCompare(b.sortKey));
  }
}
