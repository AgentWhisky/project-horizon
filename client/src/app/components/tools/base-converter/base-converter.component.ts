import { Component, inject } from '@angular/core';
import { BaseConvertTileComponent } from './base-convert-tile/base-convert-tile.component';
import { MatDialog } from '@angular/material/dialog';

import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { RemoveConfirmComponent } from '../../../dialogs/remove-confirm/remove-confirm.component';
import { BaseConverterService } from './base-converter.service';
import { filter, tap } from 'rxjs';
import { AddBaseDialogComponent } from './add-base-dialog/add-base-dialog.component';

@Component({
  selector: 'app-base-converter',
  imports: [MatButtonModule, MatIconModule, MatTabsModule, BaseConvertTileComponent],
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
      .open(AddBaseDialogComponent, { data: { existingBases: this.bases() }, height: '220px', width: '560px' })
      .afterClosed()
      .pipe(
        filter((result) => result && result.status),
        tap((result) => this.baseConverterServce.addBase(result.base))
      )
      .subscribe();
  }

  onRemoveBase(base: number) {
    const message = `Are you sure you want to remove the Base ${base} tile?`;

    this.dialog
      .open(RemoveConfirmComponent, { data: { message } })
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
      .open(RemoveConfirmComponent, { data: { message } })
      .afterClosed()
      .pipe(
        filter((result) => result),
        tap(() => this.baseConverterServce.removeAllBases())
      )
      .subscribe();
  }

  onAddBaseConversion(base: number) {
    const convertBase = this.baseConversions().find((item) => item.base === base);
    if (!convertBase) {
      return;
    }
    const existingBases = [base, ...convertBase.conversions];

    this.dialog
      .open(AddBaseDialogComponent, { data: { existingBases }, height: '220px', width: '560px' })
      .afterClosed()
      .pipe(
        filter((result) => result && result.status),
        tap((result) => this.baseConverterServce.addConversion(base, result.base))
      )
      .subscribe();
  }

  onRemoveBaseConversion(base: number, conversion: number) {
    console.log(base, conversion);

    const message = `Are you sure you want to remove the Base ${conversion} conversion for Base ${base}?`;

    this.dialog
      .open(RemoveConfirmComponent, { data: { message } })
      .afterClosed()
      .pipe(
        filter((result) => result),
        tap(() => this.baseConverterServce.removeConversion(base, conversion))
      )
      .subscribe();
  }
}
