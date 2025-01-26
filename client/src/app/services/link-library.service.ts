import { computed, inject, Injectable, signal } from '@angular/core';
import { TokenService } from './token.service';
import {
  Link,
  LinkCategory,
  LinkCategoryCode,
  LinksByCategory,
  LinkTag,
  LinkTagCode,
  NewLink,
  NewLinkCategory,
  NewLinkTag,
} from '../types/link-library';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';
import { FormBuilder, Validators } from '@angular/forms';
import { DeleteResponse } from '../types/delete-response';

@Injectable({
  providedIn: 'root',
})
export class LinkLibraryService {
  private tokenService = inject(TokenService);
  private fb = inject(FormBuilder);

  private _links = signal<Link[]>([]);
  readonly links = this._links.asReadonly();

  private _linkCategories = signal<LinkCategoryCode[]>([]);
  readonly linkCategories = this._linkCategories.asReadonly();
  readonly linkCategoryList = computed(() => this._linkCategories().map((item) => item.name));

  private _linkTags = signal<LinkTagCode[]>([]);
  readonly linkTags = this._linkTags.asReadonly();
  readonly linkTagList = computed(() => this._linkTags().map((item) => item.name));

  private _linkFilter = signal('');
  readonly filterForm = signal(this.getFilterForm());

  readonly _filteredLinks = computed(() =>
    this._links().filter(
      (link) =>
        link.name.toLowerCase().includes(this._linkFilter().toLowerCase()) ||
        (link.tags?.some((tag) => tag.name.toLowerCase().includes(this._linkFilter().toLowerCase())) ?? false)
    )
  );

  readonly linksByCategory = computed(() => this.getLinksByCategory(this._filteredLinks()));

  // *** Filter Functions ***
  getFilterForm() {
    const filterForm = this.fb.group({
      filter: ['', [Validators.maxLength(255)]],
    });

    filterForm.controls['filter'].valueChanges.subscribe((value) => {
      this._linkFilter.set(value ?? '');
    });

    return filterForm;
  }

  resetForm() {
    this.filterForm().reset();
  }

  // *** Links ***
  async loadLibraryLinks() {
    try {
      const libraryLinks = await this.getLibraryLinks();
      this._links.set(libraryLinks);
    } catch (error) {
      console.error(`Error Fetching Links: ${error}`);
    }
  }

  async addLink(link: NewLink) {
    try {
      const newLink = await this.postLibraryLink(link);
      this._links.set([...this._links(), newLink]);
    } catch (error) {
      console.error(`Error Creating Link: ${error}`);
    }
  }

  async updateLink(link: Link) {
    try {
      const updatedLink = await this.putLibraryLink(link);

      const updatedIndex = this._links().findIndex((item) => item.id === link.id);

      const updatedLinks: Link[] = [...this._links().filter((item) => item.id !== link.id)];
      updatedLinks.splice(updatedIndex, 0, updatedLink);

      this._links.set(updatedLinks);
    } catch (error) {
      console.error(`Error Updating Link: ${error}`);
    }
  }

  async removeLink(id: number) {
    try {
      const deleteResponse = await this.deleteLibraryLink(id);

      if (deleteResponse.success) {
        this._links.set([...this._links().filter((item) => item.id !== deleteResponse.id)]);
      }
    } catch (error) {
      console.error(`Error Removing Link: ${error}`);
    }
  }

  // *** Categories ***
  async loadLinkCategories() {
    try {
      const linkCategories = await this.getLinkCategories();
      this._linkCategories.set(linkCategories);
    } catch (error) {
      console.error(`Error Fetching Link Categories: ${error}`);
    }
  }

  async addLinkCategory(newCategory: NewLinkCategory) {
    try {
      const linkCategory = await this.postLinkCategory(newCategory);
      this._linkCategories.set([...this._linkCategories(), linkCategory]);
    } catch (error) {
      console.error(`Error Creating Category: ${error}`);
    }
  }

  async updateLinkCategory(category: LinkCategory) {
    try {
      const updatedCategory = await this.putLinkCategory(category);

      const updatedIndex = this._linkCategories().findIndex((item) => item.id === category.id);

      const updatedCategories: LinkCategoryCode[] = [...this._linkCategories().filter((item) => item.id !== category.id)];
      updatedCategories.splice(updatedIndex, 0, updatedCategory);

      this._linkCategories.set(updatedCategories);
    } catch (error) {
      console.error(`Error Updating Category: ${error}`);
    }
  }

  async removeLinkCategory(id: number) {
    try {
      const deleteResponse = await this.deleteLinkCategory(id);

      if (deleteResponse.success) {
        this._linkCategories.set([...this.linkCategories().filter((item) => item.id !== deleteResponse.id)]);
      }
    } catch (error) {
      console.error(`Error Removing Category: ${error}`);
    }
  }

  // *** Tags ***
  async loadLinkTags() {
    try {
      const linkTags = await this.getLinkTags();
      this._linkTags.set(linkTags);
    } catch (error) {
      console.error(`Error Fetching Link Tags: ${error}`);
    }
  }

  async addLinkTag(newTag: NewLinkTag) {
    try {
      const linkTag = await this.postLinkTag(newTag);
      this._linkTags.set([...this._linkTags(), linkTag]);
    } catch (error) {
      console.error(`Error Creating Tag: ${error}`);
    }
  }

  async updateLinkTag(tag: LinkTag) {
    try {
      const updatedTag = await this.putLinkTag(tag);

      const updatedIndex = this._linkTags().findIndex((item) => item.id === tag.id);

      const updatedTags: LinkTagCode[] = [...this._linkTags().filter((item) => item.id !== tag.id)];
      updatedTags.splice(updatedIndex, 0, updatedTag);

      this._linkTags.set(updatedTags);
    } catch (error) {
      console.error(`Error Updating Tag: ${error}`);
    }
  }

  async removeLinkTag(id: number) {
    try {
      const deleteResponse = await this.deleteLinkTag(id);

      if (deleteResponse.success) {
        this._linkTags.set([...this.linkTags().filter((item) => item.id !== deleteResponse.id)]);
      }
    } catch (error) {
      console.error(`Error Removing Tag: ${error}`);
    }
  }

  // *** Private Link Functions ***
  private async getLibraryLinks() {
    const links$ = this.tokenService.getWithTokenRefresh<Link[]>('/link-library');
    return firstValueFrom(links$);
  }

  private async putLibraryLink(link: Link) {
    const link$ = this.tokenService.putWithTokenRefresh<Link>(`/link-library/${link.id}`, link);
    return firstValueFrom(link$);
  }

  private async postLibraryLink(newLink: NewLink) {
    const link$ = this.tokenService.postWithTokenRefresh<Link>('/link-library', newLink);
    return firstValueFrom(link$);
  }

  private async deleteLibraryLink(id: number) {
    const deleteResponse$ = this.tokenService.deleteWithTokenRefresh<DeleteResponse>(`/link-library/${id}`);
    return firstValueFrom(deleteResponse$);
  }

  // *** Private Link Category Functions ***
  private async getLinkCategories() {
    const linkCategories$ = this.tokenService.getWithTokenRefresh<LinkCategoryCode[]>('/link-library/categories');
    return firstValueFrom(linkCategories$);
  }

  private async putLinkCategory(category: LinkCategory) {
    const link$ = this.tokenService.putWithTokenRefresh<LinkCategoryCode>(`/link-library/categories/${category.id}`, category);
    return firstValueFrom(link$);
  }

  private async postLinkCategory(newCategory: NewLinkCategory) {
    const link$ = this.tokenService.postWithTokenRefresh<LinkCategoryCode>('/link-library/categories', newCategory);
    return firstValueFrom(link$);
  }

  private async deleteLinkCategory(id: number) {
    const deleteResponse$ = this.tokenService.deleteWithTokenRefresh<DeleteResponse>(`/link-library/categories/${id}`);
    return firstValueFrom(deleteResponse$);
  }

  // *** Private Link Tag Functions
  private async getLinkTags() {
    const linkTags$ = this.tokenService.getWithTokenRefresh<LinkTagCode[]>('/link-library/tags');
    return firstValueFrom(linkTags$);
  }

  private async putLinkTag(tag: LinkTag) {
    const link$ = this.tokenService.putWithTokenRefresh<LinkTagCode>(`/link-library/tags/${tag.id}`, tag);
    return firstValueFrom(link$);
  }

  private async postLinkTag(newTag: NewLinkTag) {
    const link$ = this.tokenService.postWithTokenRefresh<LinkTagCode>('/link-library/tags', newTag);
    return firstValueFrom(link$);
  }

  private async deleteLinkTag(id: number) {
    const deleteResponse$ = this.tokenService.deleteWithTokenRefresh<DeleteResponse>(`/link-library/tags/${id}`);
    return firstValueFrom(deleteResponse$);
  }

  // ** Group Links ***
  private getLinksByCategory(links: Link[]) {
    const linksByCategoryObj: { [key: number]: LinksByCategory } = {};

    links.forEach((link) => {
      const category = link.category;
      const categoryId = category.id;

      if (!linksByCategoryObj[categoryId]) {
        linksByCategoryObj[categoryId] = {
          id: categoryId,
          name: category.name,
          description: category.description,
          links: [],
        };
      }

      linksByCategoryObj[categoryId].links.push(link);
    });

    return Object.values(linksByCategoryObj).sort((a, b) => a.name.localeCompare(b.name));
  }
}
