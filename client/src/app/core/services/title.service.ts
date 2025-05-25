import { inject, Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { DEFAULT_TITLE } from '../constants/title.constants';

@Injectable({
  providedIn: 'root',
})
export class TitleService {
  private title = inject(Title);

  constructor() {
    this.title.setTitle(DEFAULT_TITLE);
  }

  setTitle(title: string) {
    this.title.setTitle(`${DEFAULT_TITLE} - ${title}`);
  }

  resetTitle() {
    this.title.setTitle(DEFAULT_TITLE);
  }
}
