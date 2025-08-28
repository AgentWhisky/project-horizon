import { inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { TokenService } from '@hz/core/services';
import { LOADING_STATUS } from '@hz/core/constants';

import { Link, LinksByCategory } from './link-library';

@Injectable({
  providedIn: 'root',
})
export class LinkLibraryService {
  private tokenService = inject(TokenService);

  private _links = signal<Link[]>([]);
  readonly links = this._links.asReadonly();

  private _loadingStatus = signal<number>(LOADING_STATUS.NOT_LOADED);
  readonly loadingStatus = this._loadingStatus.asReadonly();

  // *** Links ***
  async loadLibraryLinks() {
    try {
      this._loadingStatus.set(LOADING_STATUS.IN_PROGRESS);
      const links = await this.getLibraryLinks();
      this._links.set(links);
      this._loadingStatus.set(LOADING_STATUS.SUCCESS);
    } catch (error) {
      this._loadingStatus.set(LOADING_STATUS.FAILED);
      console.error(`Error Fetching Links: ${error}`);
    }
  }

  // *** Private Link Functions ***
  private async getLibraryLinks() {
    const links$ = this.tokenService.getWithTokenRefresh<Link[]>('/link-library/links');
    return firstValueFrom(links$);
  }

  getLinksByCategory(links: Link[]) {
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
