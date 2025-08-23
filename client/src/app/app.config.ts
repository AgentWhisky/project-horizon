import { ApplicationConfig, inject, provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

import { IconService, TitleService, TokenService, VersionHistoryService } from '@hz/core/services';
import { tokenInterceptor } from '@hz/core/interceptors';
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
    provideAnimationsAsync(),
  ],
};
