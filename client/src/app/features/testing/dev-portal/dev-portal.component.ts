import { Component, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';

import { HzStatusType } from '@hz/core/models';
import { SNACKBAR_INTERVAL } from '@hz/core/constants';
import { HzBannerModule, HzChipModule } from '@hz/shared/components';
import { HzCardModule } from '@hz/shared/components/hz-card';

@Component({
  selector: 'hz-dev-portal',
  imports: [MatButtonModule, MatIconModule, MatTabsModule, RouterModule, HzBannerModule, HzChipModule, HzCardModule],
  templateUrl: './dev-portal.component.html',
  styleUrl: './dev-portal.component.scss',
})
export class DevPortalComponent {
  private snackbar = inject(MatSnackBar);

  readonly types = signal<HzStatusType[]>(['success', 'warning', 'error', 'primary', 'base']);

  onClickChip(text: string) {
    this.snackbar.open(`Chip Clicked: ${text}`, 'Close', { duration: SNACKBAR_INTERVAL.NORMAL });
  }

  onCloseChip(text: string) {
    this.snackbar.open(`Chip Closed: ${text}`, 'Close', { duration: SNACKBAR_INTERVAL.NORMAL });
  }
}
