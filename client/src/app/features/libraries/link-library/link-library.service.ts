import { inject, Injectable, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, of, tap } from 'rxjs';

import { TokenService } from '@hz/core/services';
import { HzLoadingState } from '@hz/core/utilities';

import { Link, LinksByCategory } from './resources/link-library.model';

@Injectable({
  providedIn: 'root',
})
export class LinkLibraryService {
  private tokenService = inject(TokenService);

  private readonly _links = signal<Link[]>([]);
  readonly links = this._links.asReadonly();

  readonly loadingState = new HzLoadingState('Link Library');

  // *** Links ***
  async loadLibraryLinks() {
    if (this.loadingState.isLoading()) {
      return;
    }

    this.loadingState.setInProgress();

    this.tokenService
      .getWithTokenRefresh<Link[]>('/link-library/links')
      .pipe(
        tap((links: Link[]) => {
          this._links.set(links);
          this.loadingState.setSuccess();
        }),
        catchError((err: HttpErrorResponse) => {
          this.loadingState.setFailed(err.status);
          console.error(`Failed to fetch Link Library`, { error: err });
          return of(null);
        })
      )
      .subscribe();
  }

  /** Private Functions */
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
