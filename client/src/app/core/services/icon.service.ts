import { inject, Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

import { ASSET_URLS } from '../constants';

@Injectable({
  providedIn: 'root',
})
export class IconService {
  private matIconRegistry = inject(MatIconRegistry);
  private domSanitizer = inject(DomSanitizer);

  private readonly icons: Record<string, string> = {
    github: ASSET_URLS.ICONS.GITHUB,
    linkedin: ASSET_URLS.ICONS.LINKEDIN,
    steam: ASSET_URLS.ICONS.STEAM,
    'timeline-marker': ASSET_URLS.ICONS.TIMELINE_MARKER,
    'timeline-marker-latest': ASSET_URLS.ICONS.TIMELINE_MARKER_LATEST,
  };

  registerIcons(): void {
    Object.entries(this.icons).forEach(([name, path]) => {
      this.matIconRegistry.addSvgIcon(name, this.domSanitizer.bypassSecurityTrustResourceUrl(path));
    });
  }
}
