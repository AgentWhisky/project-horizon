import { Component, inject } from '@angular/core';
import { BaseConvertTileComponent } from './base-convert-tile/base-convert-tile.component';
import { MatDialog } from '@angular/material/dialog';
import { RemoveConfirmComponent } from '../../../dialogs/remove-confirm/remove-confirm.component';
import { BaseConverterService } from './base-converter.service';
import { filter, tap } from 'rxjs';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-base-converter',
  imports: [MatTabsModule, BaseConvertTileComponent],
  templateUrl: './base-converter.component.html',
  styleUrl: './base-converter.component.scss',
})
export class BaseConverterComponent {
  private baseConverterServce = inject(BaseConverterService);
  private dialog = inject(MatDialog);

  readonly basePresets = this.baseConverterServce.basePresets;

  onAddBaseConversion(base: number) {
    console.log('ADD', base);
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
}
