import { computed, effect, Injectable, signal } from '@angular/core';
import { TokenService } from '../../services/token.service';
import { LibraryLink, LinksByCategory } from './link-library';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LinkLibraryService {
  private _libraryLinks = signal<LibraryLink[]>([]);
  readonly linksByCategory = computed(() => this.getLinksByCategory(this._libraryLinks()));

  constructor(private tokenService: TokenService) {
    effect(() => {
      console.log(this._libraryLinks());
    });

    effect(() => {
      console.log(this.linksByCategory());
    });
  }

  async loadLibraryLinks() {
    try {
      const libraryLinks = await this.getLibraryLinks();
      this._libraryLinks.set(libraryLinks);
    } catch (error) {
      console.log(`Error Fetching Links: ${error}`);
    }
  }

  private async getLibraryLinks() {
    const url = '/link-library';
    const links$ = this.tokenService.getWithTokenRefresh<LibraryLink[]>(url);

    return firstValueFrom(links$);
  }

  private getLinksByCategory(links: LibraryLink[]) {
    return links.reduce((acc, link) => {
      const { category, ...linkWithoutCategory } = link;

      if (!acc[category]) {
        acc[category] = [];
      }

      acc[category].push(linkWithoutCategory);

      return acc;
    }, {} as LinksByCategory);
  }
}
