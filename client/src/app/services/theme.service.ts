import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private _isDarkmode = signal<boolean>(this.getTheme());
  readonly isDarkmode = this._isDarkmode.asReadonly();

  constructor() {
    document.body.classList.toggle('dark-theme', this._isDarkmode());
    document.body.classList.toggle('light-theme', !this._isDarkmode());
  }

  toggleTheme() {
    const theme = !this._isDarkmode();

    this._isDarkmode.set(theme);
    this.setTheme(theme);

    document.body.classList.toggle('dark-theme', theme);
    document.body.classList.toggle('light-theme', !theme);
  }

  private setTheme(isDarkmode: boolean) {
    localStorage.setItem('isDarkmode', JSON.stringify(isDarkmode));
  }

  private getTheme() {
    return JSON.parse(localStorage.getItem('isDarkmode') || 'false');
  }
}
