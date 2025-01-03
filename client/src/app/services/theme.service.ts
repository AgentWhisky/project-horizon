import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private _isDarkTheme = signal<boolean>(this.getTheme());
  readonly isDarkTheme = this._isDarkTheme.asReadonly();

  constructor() {
    document.body.classList.toggle('dark-theme', this._isDarkTheme());
  }

  toggleTheme() {
    this._isDarkTheme.set(!this._isDarkTheme());
    document.body.classList.toggle('dark-theme', this._isDarkTheme());

    this.setTheme();
  }

  private setTheme() {
    localStorage.setItem('darkTheme', JSON.stringify(this._isDarkTheme()));
  }

  private getTheme() {
    return JSON.parse(localStorage.getItem('darkTheme') || 'false');
  }
}
