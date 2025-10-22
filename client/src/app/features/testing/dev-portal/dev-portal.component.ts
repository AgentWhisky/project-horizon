import { Component, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';

import { HzStatusType } from '@hz/core/models';
import { LOREM_IPSUM, SNACKBAR_INTERVAL } from '@hz/core/constants';
import {
  HzBannerModule,
  HzBreadcrumbItem,
  HzBreadcrumbModule,
  HzCardModule,
  HzChipModule,
  HzCommand,
  HzCommandPaletteModule,
  HzLoadingSpinnerModule,
} from '@hz/shared/components';
import { TitleCasePipe } from '@angular/common';
import {
  COMMANDS_LATEX,
  COMMANDS_DEV,
  COMMANDS_GIT,
  COMMANDS_AI,
  COMMANDS_BROWSER,
  COMMANDS_THEME,
  COMMANDS_NAV,
  COMMANDS_UTIL,
  COMMANDS_COMPONENTS,
  COMMANDS_MATH,
  HZ_BREAKCRUMB_SETS,
} from './dev-portal.constants';

@Component({
  selector: 'hz-dev-portal',
  imports: [
    
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    RouterModule,
    HzBannerModule,
    HzChipModule,
    HzCardModule,
    HzBreadcrumbModule,
    HzCommandPaletteModule,
    HzLoadingSpinnerModule,
    TitleCasePipe,
  ],
  templateUrl: './dev-portal.component.html',
  styleUrl: './dev-portal.component.scss',
})
export class DevPortalComponent {
  private snackbar = inject(MatSnackBar);

  readonly types = signal<HzStatusType[]>(['success', 'warning', 'error', 'primary', 'base']);

  readonly LOREM_IPSUM = LOREM_IPSUM;

  /** COMMANDS */
  readonly COMMANDS_LATEX = COMMANDS_LATEX;
  readonly COMMANDS_DEV = COMMANDS_DEV;
  readonly COMMANDS_GIT = COMMANDS_GIT;
  readonly COMMANDS_AI = COMMANDS_AI;
  readonly COMMANDS_BROWSER = COMMANDS_BROWSER;
  readonly COMMANDS_THEME = COMMANDS_THEME;
  readonly COMMANDS_NAV = COMMANDS_NAV;
  readonly COMMANDS_UTIL = COMMANDS_UTIL;
  readonly COMMANDS_COMPONENTS = COMMANDS_COMPONENTS;
  readonly COMMANDS_MATH = COMMANDS_MATH;

  readonly HZ_BREAKCRUMB_SETS = HZ_BREAKCRUMB_SETS;

  onClickChip(text: string) {
    this.snackbar.open(`Chip Clicked: ${text}`, 'Close', { duration: SNACKBAR_INTERVAL.NORMAL });
  }

  onCloseChip(text: string) {
    this.snackbar.open(`Chip Closed: ${text}`, 'Close', { duration: SNACKBAR_INTERVAL.NORMAL });
  }
}
