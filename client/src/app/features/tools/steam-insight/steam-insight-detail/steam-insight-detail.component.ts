import { Component, computed, effect, inject, input, OnDestroy, OnInit, viewChild } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { CommonModule, TitleCasePipe } from '@angular/common';

import { SteamInsightDetailService } from './steam-insight-detail.service';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { DecodeHtmlPipe } from '../../../../core/pipes/decode-html.pipe';
import { MatExpansionModule } from '@angular/material/expansion';
import { SteamAchievement } from './steam-insight-detail';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ScreenService } from '../../../../core/services/screen.service';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { TitleService } from '../../../../core/services/title.service';
import { MatDividerModule } from '@angular/material/divider';
import { SecureUrlPipe } from '../../../../core/pipes/secure-url.pipe';

@Component({
  selector: 'hz-steam-insight-detail',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatTabsModule,
    MatChipsModule,
    MatCardModule,
    MatExpansionModule,
    MatTableModule,
    MatSlideToggleModule,
    MatPaginatorModule,
    MatDividerModule,
    RouterModule,
    FormsModule,
    CommonModule,
    TitleCasePipe,
    DecodeHtmlPipe,
    SecureUrlPipe,
  ],
  templateUrl: './steam-insight-detail.component.html',
  styleUrl: './steam-insight-detail.component.scss',
})
export class SteamInsightDetailComponent implements OnInit, OnDestroy {
  readonly steamInsightDetailService = inject(SteamInsightDetailService);

  readonly appid = input.required<number>();

  private screenService = inject(ScreenService);
  private titleService = inject(TitleService);

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

  constructor() {
    // Set Not Found on Load Failure
    effect(() => this.loadingFailed() && this.titleService.setTitle('Not Found'));

    // Achievements Table
    effect(() => this.onAppDetailsInit());

    effect(() => {
      this.achievementDataSource.paginator = this.achievementPaginator() ?? null;
    });
  }

  ngOnInit() {
    this.steamInsightDetailService.loadSteamAppDetails(this.appid());
  }

  ngOnDestroy() {
    this.titleService.resetTitle();
    this.steamInsightDetailService.resetAppDetails();
  }

  private onAppDetailsInit() {
    this.titleService.setTitle(this.appDetails().name);
    this.achievementDataSource.data = this.appDetails().achievements?.data ?? [];
  }
}
