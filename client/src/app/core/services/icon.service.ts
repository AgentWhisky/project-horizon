import { inject, Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class IconService {
  private matIconRegistry = inject(MatIconRegistry);
  private domSanitizer = inject(DomSanitizer);

  private readonly icons: Record<string, string> = {
    github: 'assets/icons/github-brands.svg',
    linkedin: 'assets/icons/linkedin-brands.svg',
    steam: 'assets/icons/steam-brands.svg',
  };

  registerIcons(): void {
    Object.entries(this.icons).forEach(([name, path]) => {
      this.matIconRegistry.addSvgIcon(name, this.domSanitizer.bypassSecurityTrustResourceUrl(path));
    });
  }
}
