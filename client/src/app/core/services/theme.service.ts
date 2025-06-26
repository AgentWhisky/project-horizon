import { Injectable, signal } from '@angular/core';
import { DARK_THEME } from '../constants/storage-keys.constant';
import { DARK_MODE_CLASS_NAME } from '../constants/theme.constant';

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
    localStorage.setItem(DARK_THEME, JSON.stringify(isDarkMode));
  }

  private loadTheme() {
    return JSON.parse(localStorage.getItem(DARK_THEME) || 'false');
  }
}
