import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'hz-app-version-dialog',
  imports: [MatDialogModule, MatButtonModule, MatIconModule, DatePipe],
  templateUrl: './app-version-dialog.component.html',
  styleUrl: './app-version-dialog.component.scss',
})
export class AppVersionDialogComponent {
  readonly dialogRef = inject(MatDialogRef<AppVersionDialogComponent>);

  readonly tempData = [
    { version: '1.5.0', date: '2025-07-23', description: 'Lorem ipsum description' },
    { version: '1.4.0', date: '2025-05-01', description: 'Lorem ipsum description' },
    { version: '1.3.0', date: '2025-04-12', description: 'Lorem ipsum description' },
    { version: '1.2.0', date: '2025-04-08', description: 'Lorem ipsum description' },
    { version: '1.1.0', date: '2025-03-19', description: 'Lorem ipsum description' },
    { version: '1.0.0', date: '2025-01-31', description: 'Lorem ipsum description' },
  ];

  onClose() {
    this.dialogRef.close();
  }
}
