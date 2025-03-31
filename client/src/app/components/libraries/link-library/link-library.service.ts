import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { TokenService } from '../../../services/token.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Link, LinkLibrary, LinksByCategory } from './link-library';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LinkLibraryService {
  private tokenService = inject(TokenService);
  private fb = inject(FormBuilder);

  private _links = signal<Link[]>([]);
  readonly links = this._links.asReadonly();

  private _tags = signal<string[]>([]);
  readonly tags = this._tags.asReadonly();

  private _categories = signal<string[]>([]);
  readonly categories = this._categories.asReadonly();

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

  constructor() {
    effect(() => console.log(this._tags()));
    effect(() => console.log(this._categories()));
  }

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
      this._links.set(libraryLinks.links);
      this._categories.set(libraryLinks.categories);
      this._tags.set(libraryLinks.tags);
    } catch (error) {
      console.error(`Error Fetching Links: ${error}`);
    }
  }

  // *** Private Link Functions ***
  private async getLibraryLinks() {
    const links$ = this.tokenService.getWithTokenRefresh<LinkLibrary>('/link-library');
    return firstValueFrom(links$);
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

    // Sort links within category by sort key
    Object.values(linksByCategoryObj).forEach((category) => {
      category.links.sort((a, b) => {
        const sortKeyA = a.sortKey || '';
        const sortKeyB = b.sortKey || '';
        return sortKeyA.localeCompare(sortKeyB);
      });
    });

    return Object.values(linksByCategoryObj).sort((a, b) => a.name.localeCompare(b.name));
  }
}
