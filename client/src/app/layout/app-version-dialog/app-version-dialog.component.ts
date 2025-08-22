import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { VersionHistoryService } from '../../core/services/version-history.service';
import { HzTimelineModule } from '../../shared/components/hz-timeline';
import { APP_URLS } from '@hz/constants';

@Component({
  selector: 'hz-app-version-dialog',
  imports: [MatDialogModule, MatButtonModule, MatIconModule, CommonModule, RouterModule, DatePipe, HzTimelineModule],
  templateUrl: './app-version-dialog.component.html',
  styleUrl: './app-version-dialog.component.scss',
})
export class AppVersionDialogComponent {
  readonly dialogRef = inject(MatDialogRef<AppVersionDialogComponent>);
  readonly githubRepoUrl = APP_URLS.APP_GITHUB_REPOSITORY;

  private versionHistoryService = inject(VersionHistoryService);

  readonly versionHistory = this.versionHistoryService.versionHistory;

  onClose() {
    this.dialogRef.close();
  }
}
