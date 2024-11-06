import { effect, Injectable, signal } from '@angular/core';
import { TokenService } from '../../services/token.service';
import { LibraryLink } from './link-library';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LinkLibraryService {
  private _libraryLinks = signal<LibraryLink[]>([]);
  

  constructor(private tokenService: TokenService) {
    effect(() => {
      console.log(this._libraryLinks());
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
}
