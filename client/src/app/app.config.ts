import { ApplicationConfig, inject, provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

import { tokenInterceptor } from './core/interceptors/token.interceptor';
import { TitleService } from './core/services/title.service';
import { TokenService } from './core/services/token.service';
import { IconService } from './core/services/icon.service';
import { VersionHistoryService } from './core/services/version-history.service';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withViewTransitions(), withComponentInputBinding()),
    provideHttpClient(withInterceptors([tokenInterceptor])),
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } }, // Set all mat-form-fields to outline appearance
    provideAppInitializer(async () => {
      const titleService = inject(TitleService);
      const tokenService = inject(TokenService);
      const iconService = inject(IconService);
      const versionHistoryService = inject(VersionHistoryService);

      iconService.registerIcons();
      titleService.resetTitle();
      versionHistoryService.loadVersionHistory();

      await tokenService.onInitUser();
    }),
  ],
};
