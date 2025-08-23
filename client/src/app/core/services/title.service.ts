import { inject, Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { DEFAULT_APP_TITLE } from '../constants';

@Injectable({
  providedIn: 'root',
})
export class TitleService {
  private title = inject(Title);

  setTitle(title: string) {
    this.title.setTitle(`${DEFAULT_APP_TITLE} - ${title}`);
  }

  resetTitle() {
    this.title.setTitle(DEFAULT_APP_TITLE);
  }
}
