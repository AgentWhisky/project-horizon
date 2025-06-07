import { Component, computed, effect, inject, input, OnDestroy, signal, ViewChild, viewChild } from '@angular/core';

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

import { CommonModule, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ScreenService } from '../../../../core/services/screen.service';
import { TitleService } from '../../../../core/services/title.service';
import { SteamInsightDetailService } from './steam-insight-detail.service';
import { SteamDlcTileComponent } from './steam-dlc-tile/steam-dlc-tile.component';
import { DecodeHtmlPipe } from '../../../../core/pipes/decode-html.pipe';
import { SecureUrlPipe } from '../../../../core/pipes/secure-url.pipe';
import { DlcDetails, SteamAchievement } from './steam-insight-detail';
import { DLC_PAGE_SIZE, DLC_PAGE_SIZE_MOBILE } from '../../../../core/constants/steam-insight.constant';

@Component({
  selector: 'hz-steam-insight-detail',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatTabsModule,
    MatChipsModule,
    MatCardModule,
    MatTableModule,
    MatSlideToggleModule,
    MatPaginatorModule,
    MatDividerModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
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
  private steamInsightDetailService = inject(SteamInsightDetailService);
  private screenService = inject(ScreenService);
  private titleService = inject(TitleService);

  readonly appid = input.required<number>();

  readonly appDetails = this.steamInsightDetailService.appDetails;
  readonly loadingAppDetails = this.steamInsightDetailService.loadingAppDetails;
  readonly loadingFailed = this.steamInsightDetailService.loadingFailed;
  readonly showHiddenAchievements = this.steamInsightDetailService.showHiddenAchievements;

  readonly isMobileScreen = this.screenService.isMobileScreen;

  // Achievements Table
  readonly achievementPaginator = viewChild<MatPaginator>('achievementPaginator');
  readonly achievementDisplayedColumns = computed(() =>
    this.isMobileScreen() ? ['index', 'icon', 'name'] : ['index', 'icon', 'name', 'description']
  );
  readonly achievementDataSource = new MatTableDataSource<SteamAchievement>();

  // DLC Display
  @ViewChild('dlcPaginator') dlcPaginator!: MatPaginator;
  readonly dlcPageIndex = signal<number>(0);
  readonly dlcPageSize = computed(() => (this.isMobileScreen() ? DLC_PAGE_SIZE_MOBILE : DLC_PAGE_SIZE));
  readonly dlcPage = computed(() => this.getDlcPage(this.dlcPageIndex()));
  readonly showDlcPaginator = computed(() => this.appDetails().dlc.length > this.dlcPageSize());

  constructor() {
    // Load app details on appid change
    effect(() => this.steamInsightDetailService.loadSteamAppDetails(this.appid()));

    // Initialize on app details update
    effect(() => this.onAppDetailsInit());

    // Set Not Found on Load Failure
    effect(() => this.loadingFailed() && this.titleService.setTitle('Not Found'));

    effect(() => {
      this.achievementDataSource.paginator = this.achievementPaginator() ?? null;
    });
  }

  ngOnDestroy() {
    this.titleService.resetTitle();
    this.steamInsightDetailService.resetAppDetails();
  }

  onDlcPageChange(event: PageEvent) {
    const newPage = event.pageIndex;
    this.dlcPageIndex.set(newPage);
  }

  // *** PRIVATE FUNCTIONS ***
  private onAppDetailsInit() {
    this.titleService.setTitle(this.appDetails().name);
    this.achievementDataSource.data = this.appDetails().achievements?.data ?? [];
  }

  private getDlcPage(pageIndex: number): DlcDetails[] {
    const pageSize = this.dlcPageSize();
    const start = pageIndex * pageSize;
    const end = start + pageSize;

    return this.appDetails().dlc.slice(start, end);
  }
}
