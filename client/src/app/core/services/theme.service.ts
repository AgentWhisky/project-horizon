import { Injectable, signal } from '@angular/core';
import { DARK_MODE_CLASS_NAME, STORAGE_KEYS } from '../constants';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private _isDarkTheme = signal<boolean>(this.loadTheme());
  readonly isDarkTheme = this._isDarkTheme.asReadonly();

  constructor() {
    this.applyThemeClass(this._isDarkTheme());
  }

  toggleTheme() {
    const isDarkMode = !this._isDarkTheme();

    this._isDarkTheme.set(isDarkMode);
    this.applyThemeClass(isDarkMode);
    this.saveTheme(isDarkMode);
  }

  private applyThemeClass(isDarkTheme: boolean) {
    document.documentElement.classList.toggle(DARK_MODE_CLASS_NAME, isDarkTheme);
  }

  private saveTheme(isDarkMode: boolean) {
    localStorage.setItem(STORAGE_KEYS.THEME.DARK_THEME, JSON.stringify(isDarkMode));
  }

  private loadTheme() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.THEME.DARK_THEME) || 'false');
  }
}
