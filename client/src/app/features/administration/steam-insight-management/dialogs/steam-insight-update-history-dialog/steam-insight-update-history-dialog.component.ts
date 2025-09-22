import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { UserDialogComponent } from 'app/features/administration/account-management/user-dialog/user-dialog.component';
import { SteamInsightUpdateRow } from '../../resources/steam-insight-management.model';
import { HzChipModule, HzStatCardModule, HzTimelineModule } from '@hz/shared/components';
import { MatButtonModule } from '@angular/material/button';
import { HzCardModule } from '@hz/shared/components/hz-card';
import { DatePipe } from '@angular/common';
import { DurationPipe } from '@hz/core/pipes';

interface DialogData {
  row: SteamInsightUpdateRow;
}

@Component({
  selector: 'hz-steam-insight-update-history-dialog',
  imports: [MatButtonModule, MatDialogModule, HzCardModule, HzChipModule, HzTimelineModule, DatePipe, DurationPipe],
  templateUrl: './steam-insight-update-history-dialog.component.html',
  styleUrl: './steam-insight-update-history-dialog.component.scss',
})
export class SteamInsightUpdateHistoryDialogComponent {
  readonly dialogRef = inject(MatDialogRef<UserDialogComponent>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  readonly row = this.data.row;

  readonly showStats =
    !!this.row.stats &&
    Object.values(this.row.stats).some(
      (section) => section && (typeof section === 'object' ? Object.values(section).some((v) => v != null) : section != null)
    );
  onClose() {
    this.dialogRef.close();
  }
}
