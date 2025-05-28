import { Component, inject } from '@angular/core';
import { BaseConvertTileComponent } from './base-convert-tile/base-convert-tile.component';

import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';

import { BaseConverterService } from './base-converter.service';
import { filter, tap } from 'rxjs';
import { BaseConvertTileDialogComponent } from './base-convert-tile-dialog/base-convert-tile-dialog.component';
import { BaseConvertConversionDialogComponent } from './base-convert-conversion-dialog/base-convert-conversion-dialog.component';
import { MessageCardComponent } from '../../../shared/components/message-card/message-card.component';
import { RemoveConfirmComponent } from '../../../shared/dialogs/remove-confirm/remove-confirm.component';

@Component({
  selector: 'hz-base-converter',
  imports: [MatButtonModule, MatIconModule, MatTabsModule, MatTooltipModule, BaseConvertTileComponent, MessageCardComponent],
  templateUrl: './base-converter.component.html',
  styleUrl: './base-converter.component.scss',
})
export class BaseConverterComponent {
  private baseConverterServce = inject(BaseConverterService);
  private dialog = inject(MatDialog);

  readonly baseConversions = this.baseConverterServce.baseConversions;
  readonly bases = this.baseConverterServce.bases;

  onAddBase() {
    this.dialog
      .open(BaseConvertTileDialogComponent, { data: { existingBases: this.bases() }, width: '560px', panelClass: 'hz-dialog-container' })
      .afterClosed()
      .pipe(
        filter((result) => result && result.status),
        tap((result) => this.baseConverterServce.addBase(result.base, result.conversions))
      )
      .subscribe();
  }

  onRemoveBase(base: number) {
    const message = `Are you sure you want to remove the Base ${base} tile?`;

    this.dialog
      .open(RemoveConfirmComponent, { data: { message }, panelClass: 'hz-dialog-container' })
      .afterClosed()
      .pipe(
        filter((result) => result),
        tap(() => this.baseConverterServce.removeBase(base))
      )
      .subscribe();
  }

  onRemoveAllBases() {
    const message = `Are you sure you want to remove all base tiles?`;

    this.dialog
      .open(RemoveConfirmComponent, { data: { message }, panelClass: 'hz-dialog-container' })
      .afterClosed()
      .pipe(
        filter((result) => result),
        tap(() => this.baseConverterServce.removeAllBases())
      )
      .subscribe();
  }

  onUpdateBaseConversions(base: number) {
    const convertBase = this.baseConversions().find((item) => item.base === base);
    if (!convertBase) {
      return;
    }

    this.dialog
      .open(BaseConvertConversionDialogComponent, {
        data: { base, existingConversions: convertBase.conversions },
        height: '220px',
        width: '560px',
        panelClass: 'hz-dialog-container',
      })
      .afterClosed()
      .pipe(
        filter((result) => result && result.status),
        tap((result) => this.baseConverterServce.updateConversions(base, result.conversions))
      )
      .subscribe();
  }

  onReorderConversions(base: number, prevIndex: number, currentIndex: number) {
    this.baseConverterServce.reorderConversions(base, prevIndex, currentIndex);
  }
}
