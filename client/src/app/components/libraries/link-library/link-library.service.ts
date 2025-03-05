import { computed, inject, Injectable, signal } from '@angular/core';
import { TokenService } from '../../../services/token.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Link, LinksByCategory } from './link-library';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LinkLibraryService {
  private tokenService = inject(TokenService);
  private fb = inject(FormBuilder);

  private _links = signal<Link[]>([]);
  readonly links = this._links.asReadonly();

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

  // *** Private Link Functions ***
  private async getLibraryLinks() {
    const links$ = this.tokenService.getWithTokenRefresh<Link[]>('/link-library');
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

    return Object.values(linksByCategoryObj).sort((a, b) => a.name.localeCompare(b.name));
  }
}
