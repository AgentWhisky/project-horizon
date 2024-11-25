import { DOCUMENT } from '@angular/common';
import { effect, Inject, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private _isDarkmode = signal<boolean>(this.loadTheme());
  readonly isDarkmode = this._isDarkmode.asReadonly();

  constructor(@Inject(DOCUMENT) private document: Document) {
    effect(() => {
      console.log('EFFECT');
      
      this.setTheme(this._isDarkmode());
    });
  }

  toggleTheme() {
    console.log(`THEME ${!this._isDarkmode()}`);

    this._isDarkmode.set(!this._isDarkmode());
  }

  private setTheme(isDarkmode: boolean) {
    const themeLink = this.document.getElementById('app-theme') as HTMLLinkElement;

    if (isDarkmode) {
      themeLink.href = 'theme-dark.css';
    } else {
      themeLink.href = 'theme-light.css';
    }
    this.saveTheme();
  }

  private saveTheme() {
    localStorage.setItem('isDarkmode', JSON.stringify(this._isDarkmode()));
  }

  private loadTheme() {
    return JSON.parse(localStorage.getItem('isDarkmode') || 'false');
  }
}
