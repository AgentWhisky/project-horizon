import { computed, Injectable, signal } from '@angular/core';
import { TokenService } from './token.service';
import { Link, LinkCategory, LinksByCategory, LinkTag, NewLink } from '../types/link-library';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';
import { FormBuilder, Validators } from '@angular/forms';
import { DeleteResponse } from '../types/delete-response';

@Injectable({
  providedIn: 'root',
})
export class LinkLibraryService {
  private _links = signal<Link[]>([]);
  readonly links = this._links.asReadonly();

  private _linkCategories = signal<LinkCategory[]>([]);
  readonly linkCategories = this._linkCategories.asReadonly();

  private _linkTags = signal<LinkTag[]>([]);
  readonly linkTags = this._linkTags.asReadonly();

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

  constructor(private tokenService: TokenService, private fb: FormBuilder) {}

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

  // *** Link Functions ***
  async loadLibraryLinks() {
    try {
      const libraryLinks = await this.getLibraryLinks();
      this._links.set(libraryLinks);
    } catch (error) {
      console.error(`Error Fetching Links: ${error}`);
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

      console.log(deleteResponse);
    } catch (error) {
      console.error(`Error Removing Link: ${error}`);
    }
  }

  // *** Dropdown Code Functions ***
  async loadLinkCategories() {
    try {
      const linkCategories = await this.getLinkCategories();
      this._linkCategories.set(linkCategories);
    } catch (error) {
      console.error(`Error Fetching Link Categories: ${error}`);
    }
  }

  async loadLinkTags() {
    try {
      const linkTags = await this.getLinkTags();
      this._linkTags.set(linkTags);
    } catch (error) {
      console.error(`Error Fetching Link Tags: ${error}`);
    }
  }

  // *** Private Functions ***
  private async getLibraryLinks() {
    const url = '/link-library';
    const links$ = this.tokenService.getWithTokenRefresh<Link[]>(url);

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

  private async getLinkCategories() {
    const linkCategories$ = this.tokenService.getWithTokenRefresh<LinkCategory[]>('/link-library/categories');
    return firstValueFrom(linkCategories$);
  }

  private async getLinkTags() {
    const linkTags$ = this.tokenService.getWithTokenRefresh<LinkTag[]>('/link-library/tags');
    return firstValueFrom(linkTags$);
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
