import { computed, inject, Injectable, signal } from '@angular/core';
import { TokenService } from '../../../services/token.service';
import { Category, CategoryPayload, Link, LinkPayload, Tag, TagPayload } from './link-library-management';
import { firstValueFrom } from 'rxjs';
import { DeleteResponse } from '../../../types/delete-response';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DownloadService } from '../../../services/download.service';

@Injectable({
  providedIn: 'root',
})
export class LinkLibraryManagementService {
  private tokenService = inject(TokenService);
  private downloadService = inject(DownloadService);
  private snackbar = inject(MatSnackBar);

  private _links = signal<Link[]>([]);
  readonly links = this._links.asReadonly();

  private _linkCategories = signal<Category[]>([]);
  readonly linkCategories = this._linkCategories.asReadonly();
  readonly linkCategoryList = computed(() => this._linkCategories().map((item) => item.name));

  private _linkTags = signal<Tag[]>([]);
  readonly linkTags = this._linkTags.asReadonly();
  readonly linkTagList = computed(() => this._linkTags().map((item) => item.name));

  // *** LINK FUNCTIONS ***
  async loadLinks() {
    try {
      const libraryLinks = await this.getLinks();
      this._links.set(libraryLinks);
    } catch (error) {
      console.error(`Error fetching links: ${error}`);
    }
  }

  async addLink(linkPayload: LinkPayload) {
    try {
      const newLink = await this.postLink(linkPayload);
      this._links.set([...this._links(), newLink]);
      this.snackbar.open('Successfully added link', 'Close', { duration: 3000 });
    } catch (error) {
      this.snackbar.open('Failed to add link', 'Close', { duration: 3000 });
      console.error(`Error adding link: ${error}`);
    }
  }

  async updateLink(id: number, linkPayload: LinkPayload) {
    try {
      const updatedLink = await this.putLink(id, linkPayload);

      const updatedIndex = this._links().findIndex((item) => item.id === id);

      const updatedLinks: Link[] = [...this._links().filter((item) => item.id !== id)];
      updatedLinks.splice(updatedIndex, 0, updatedLink);

      this._links.set(updatedLinks);
      this.snackbar.open('Successfully updated link', 'Close', { duration: 3000 });
    } catch (error) {
      this.snackbar.open('Failed to update link', 'Close', { duration: 3000 });
      console.error(`Error updating link: ${error}`);
    }
  }

  async removeLink(id: number) {
    try {
      const deleteResponse = await this.deleteLink(id);

      if (deleteResponse.success) {
        this._links.set([...this._links().filter((item) => item.id !== deleteResponse.id)]);
        this.snackbar.open('Successfully deleted link', 'Close', { duration: 3000 });
      }
    } catch (error) {
      this.snackbar.open('Failed to delete link', 'Close', { duration: 3000 });
      console.error(`Error removing link: ${error}`);
    }
  }

  // *** CATEGORY FUNCTIONS ***
  async loadCategories() {
    try {
      const linkCategories = await this.getCategories();
      this._linkCategories.set(linkCategories);
    } catch (error) {
      console.error(`Error fetching categories: ${error}`);
    }
  }

  async addCategory(categoryPayload: CategoryPayload) {
    try {
      const linkCategory = await this.postCategory(categoryPayload);
      this._linkCategories.set([...this._linkCategories(), linkCategory]);
      this.snackbar.open('Successfully added category', 'Close', { duration: 3000 });
    } catch (error) {
      this.snackbar.open('Failed to add category', 'Close', { duration: 3000 });
      console.error(`Error Creating Category: ${error}`);
    }
  }

  async updateCategory(id: number, categoryPayload: CategoryPayload) {
    try {
      const updatedCategory = await this.putCategory(id, categoryPayload);

      const updatedIndex = this._linkCategories().findIndex((item) => item.id === id);

      const updatedCategories: Category[] = [...this._linkCategories().filter((item) => item.id !== id)];
      updatedCategories.splice(updatedIndex, 0, updatedCategory);

      this._linkCategories.set(updatedCategories);
      this.snackbar.open('Successfully updated category', 'Close', { duration: 3000 });
    } catch (error) {
      this.snackbar.open('Failed to update category', 'Close', { duration: 3000 });
      console.error(`Error Updating Category: ${error}`);
    }
  }

  async removeCategory(id: number) {
    try {
      const deleteResponse = await this.deleteCategory(id);

      if (deleteResponse.success) {
        this._linkCategories.set([...this.linkCategories().filter((item) => item.id !== deleteResponse.id)]);
        this.snackbar.open('Successfully deleted category', 'Close', { duration: 3000 });
      }
    } catch (error) {
      this.snackbar.open('Failed to delete category', 'Close', { duration: 3000 });
      console.error(`Error Removing Category: ${error}`);
    }
  }

  // *** TAG FUNCTIONS ***
  async loadTags() {
    try {
      const linkTags = await this.getTags();
      this._linkTags.set(linkTags);
    } catch (error) {
      console.error(`Error fetching tags: ${error}`);
    }
  }

  async addTag(tagPayload: TagPayload) {
    try {
      const linkTag = await this.postTag(tagPayload);
      this._linkTags.set([...this._linkTags(), linkTag]);
      this.snackbar.open('Successfully added tag', 'Close', { duration: 3000 });
    } catch (error) {
      this.snackbar.open('Failed to add tag', 'Close', { duration: 3000 });
      console.error(`Error Creating Tag: ${error}`);
    }
  }

  async updateTag(id: number, tagPayload: TagPayload) {
    try {
      const updatedTag = await this.putTag(id, tagPayload);

      const updatedIndex = this._linkTags().findIndex((item) => item.id === id);

      const updatedTags: Tag[] = [...this._linkTags().filter((item) => item.id !== id)];
      updatedTags.splice(updatedIndex, 0, updatedTag);

      this._linkTags.set(updatedTags);
      this.snackbar.open('Successfully update tag', 'Close', { duration: 3000 });
    } catch (error) {
      this.snackbar.open('Failed to update tag', 'Close', { duration: 3000 });
      console.error(`Error updating tag: ${error}`);
    }
  }

  async removeTag(id: number) {
    try {
      const deleteResponse = await this.deleteTag(id);

      if (deleteResponse.success) {
        this._linkTags.set([...this.linkTags().filter((item) => item.id !== deleteResponse.id)]);
        this.snackbar.open('Successfully deleted tag', 'Close', { duration: 3000 });
      }
    } catch (error) {
      this.snackbar.open('Failed to delete tag', 'Close', { duration: 3000 });
      console.error(`Error removing tag: ${error}`);
    }
  }

  // *** Import/Export Functions
  async importLinkLibrary(file: File) {
    try {
      await this.postLinkLibraryImport(file);
      this.snackbar.open('Successfully imported Link Library', 'Close', { duration: 3000 });
    } catch (error) {
      this.snackbar.open('Failed to import Link Library', 'Close', { duration: 3000 });
      console.error(`Failed to import Link Library: ${error}`);
    }
  }

  async exportLinkLibrary() {
    try {
      const exportFile = await this.getLinkLibraryExport();

      this.downloadService.downloadFile(exportFile, 'linkLibraryExport.json');

      this.snackbar.open('Successfully exported Link Library', 'Close', { duration: 3000 });
    } catch (error) {
      this.snackbar.open('Failed to export Link Library', 'Close', { duration: 3000 });
      console.error(`Failed to export Link Library: ${error}`);
    }
  }

  // *** PRIVATE FUNCTIONS ***
  // *** LINK ***
  private async getLinks() {
    const links$ = this.tokenService.getWithTokenRefresh<Link[]>('/link-library-management/links');
    return firstValueFrom(links$);
  }

  private async postLink(linkPayload: LinkPayload) {
    const link$ = this.tokenService.postWithTokenRefresh<Link>('/link-library-management/links', linkPayload);
    return firstValueFrom(link$);
  }

  private async putLink(id: number, linkPayload: LinkPayload) {
    const link$ = this.tokenService.putWithTokenRefresh<Link>(`/link-library-management/links/${id}`, linkPayload);
    return firstValueFrom(link$);
  }

  private async deleteLink(id: number) {
    const deleteResponse$ = this.tokenService.deleteWithTokenRefresh<DeleteResponse>(`/link-library-management/links/${id}`);
    return firstValueFrom(deleteResponse$);
  }

  // *** CATEGORY ***
  private async getCategories() {
    const linkCategories$ = this.tokenService.getWithTokenRefresh<Category[]>('/link-library-management/categories');
    return firstValueFrom(linkCategories$);
  }

  private async postCategory(categoryPayload: CategoryPayload) {
    const link$ = this.tokenService.postWithTokenRefresh<Category>('/link-library-management/categories', categoryPayload);
    return firstValueFrom(link$);
  }

  private async putCategory(id: number, categoryPayload: CategoryPayload) {
    const link$ = this.tokenService.putWithTokenRefresh<Category>(`/link-library-management/categories/${id}`, categoryPayload);
    return firstValueFrom(link$);
  }

  private async deleteCategory(id: number) {
    const deleteResponse$ = this.tokenService.deleteWithTokenRefresh<DeleteResponse>(`/link-library-management/categories/${id}`);
    return firstValueFrom(deleteResponse$);
  }

  // *** TAG ***
  private async getTags() {
    const linkTags$ = this.tokenService.getWithTokenRefresh<Tag[]>('/link-library-management/tags');
    return firstValueFrom(linkTags$);
  }

  private async postTag(tagPayload: TagPayload) {
    const link$ = this.tokenService.postWithTokenRefresh<Tag>('/link-library-management/tags', tagPayload);
    return firstValueFrom(link$);
  }

  private async putTag(id: number, tagPayload: TagPayload) {
    const link$ = this.tokenService.putWithTokenRefresh<Tag>(`/link-library-management/tags/${id}`, tagPayload);
    return firstValueFrom(link$);
  }

  private async deleteTag(id: number) {
    const deleteResponse$ = this.tokenService.deleteWithTokenRefresh<DeleteResponse>(`/link-library-management/tags/${id}`);
    return firstValueFrom(deleteResponse$);
  }

  private async postLinkLibraryImport(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    const result$ = this.tokenService.postWithTokenRefresh('/link-library-management/import', formData);
    return firstValueFrom(result$);
  }

  private async getLinkLibraryExport() {
    const exportFile$ = this.tokenService.getWithTokenRefresh<Blob>(`/link-library-management/export`, {
      responseType: 'blob' as 'json',
    });
    return firstValueFrom(exportFile$);
  }
}
