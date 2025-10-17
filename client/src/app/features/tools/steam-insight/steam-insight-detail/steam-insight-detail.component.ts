import { Component, computed, effect, inject, input, OnDestroy, OnInit, signal, untracked, ViewChild, viewChild } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';

import { STEAM_INSIGHT_DLC } from '@hz/core/constants';
import { DecodeHtmlPipe, SecureUrlPipe } from '@hz/core/pipes';
import { ScreenService, TitleService } from '@hz/core/services';

import { SteamInsightDetailService } from './steam-insight-detail.service';
import { SteamDlcTileComponent } from './steam-dlc-tile/steam-dlc-tile.component';
import { Achievement, DlcDetails, Screenshot } from './steam-insight-detail.model';
import { HzBannerModule, HzBreadcrumbItem, HzChipModule, HzLoadingSpinnerModule } from '@hz/shared/components';
import { MatDialog } from '@angular/material/dialog';
import { HzImageViewDialogComponent } from '@hz/shared/dialogs';

@Component({
  selector: 'hz-steam-insight-detail',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatTabsModule,
    MatTableModule,
    MatSlideToggleModule,
    MatPaginatorModule,
    MatDividerModule,
    MatTooltipModule,
    HzLoadingSpinnerModule,
    HzChipModule,
    HzBannerModule,
    RouterModule,
    FormsModule,
    CommonModule,
    TitleCasePipe,
    DecodeHtmlPipe,
    SecureUrlPipe,
    SteamDlcTileComponent,
  ],
  templateUrl: './steam-insight-detail.component.html',
  styleUrl: './steam-insight-detail.component.scss',
})
export class SteamInsightDetailComponent implements OnDestroy {
  private screenService = inject(ScreenService);
  private titleService = inject(TitleService);
  private dialog = inject(MatDialog);
  private steamInsightDetailService = inject(SteamInsightDetailService);

  readonly appid = input.required<number>();

  readonly steamAppDetails = this.steamInsightDetailService.appDetails;
  readonly loadingState = this.steamInsightDetailService.loadingState;

  readonly showHiddenAchievements = this.steamInsightDetailService.showHiddenAchievements;

  readonly isMobileScreen = this.screenService.isMobileScreen;

  // Achievements Table
  readonly achievementPaginator = viewChild<MatPaginator>('achievementPaginator');
  readonly achievementDisplayedColumns = computed(() =>
    this.isMobileScreen() ? ['index', 'icon', 'name'] : ['index', 'icon', 'name', 'description']
  );
  readonly achievementDataSource = new MatTableDataSource<Achievement>();

  // DLC Display
  @ViewChild('dlcPaginator') dlcPaginator!: MatPaginator;
  readonly dlcPageIndex = signal<number>(0);
  readonly dlcPageSize = computed(() => (this.isMobileScreen() ? STEAM_INSIGHT_DLC.PAGE_SIZE_MOBILE : STEAM_INSIGHT_DLC.PAGE_SIZE));
  readonly dlcPage = computed(() => this.getDlcPage(this.dlcPageIndex()));
  readonly showDlcPaginator = computed(() => {
    const dlc = this.steamAppDetails()?.dlc;
    return !!dlc && dlc.length > this.dlcPageSize();
  });

  constructor() {
    // Load app details on appid change
    effect(() => {
      const appid = this.appid();

      untracked(() => {
        this.steamInsightDetailService.loadAppDetails(this.appid());
      });
    });

    // Update page on loading app details
    effect(() => {
      const appDetails = this.steamAppDetails();

      untracked(() => {
        if (appDetails && this.loadingState.isSuccess()) {
          this.titleService.setTitle(appDetails.name);
          this.achievementDataSource.data = appDetails.achievements?.data ?? [];
        } else if (this.loadingState.isFailed()) {
          this.titleService.setTitle('Not Found');
        }
      });
    });

    effect(() => {
      this.achievementDataSource.paginator = this.achievementPaginator() ?? null;
    });
  }

  ngOnDestroy() {
    this.titleService.resetTitle();
    this.steamInsightDetailService.reset();
  }

  onToggleHiddenAchievements() {
    this.steamInsightDetailService.toggleHiddenAchievements();
  }

  onDlcPageChange(event: PageEvent) {
    this.dlcPageIndex.set(event.pageIndex);
  }

  onOpenScreenshot(screenshots: Screenshot[], startIndex = 0) {
    const screenshotPaths = screenshots.map((s) => s.path_full);

    this.dialog.open(HzImageViewDialogComponent, {
      data: { screenshotPaths, startIndex },
      panelClass: 'fullscreen-dialog',
    });
  }

  // *** PRIVATE FUNCTIONS ***
  private getDlcPage(pageIndex: number): DlcDetails[] {
    const details = this.steamAppDetails();

    const dlc = details?.dlc ?? [];

    const size = this.dlcPageSize();
    const start = pageIndex * size;

    return dlc.slice(start, start + size);
  }
}
