import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { KeywordPipe } from '@hz/core/pipes';

import { SteamInsightSearchService } from './steam-insight-search.service';
import { SteamGameTileComponent } from './steam-game-tile/steam-game-tile.component';
import { SteamGameHistoryEntry } from '../steam-insight.model';
import { SteamInsightHistoryService } from '../steam-insight-history.service';
import { HzBannerModule, HzChipModule, HzLoadingSpinnerModule } from '@hz/shared/components';

@Component({
  selector: 'hz-steam-insight-search',
  imports: [
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatPaginatorModule,
    MatChipsModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    HzLoadingSpinnerModule,
    HzBannerModule,
    HzChipModule,
    RouterModule,
    ReactiveFormsModule,
    SteamGameTileComponent,
  ],
  templateUrl: './steam-insight-search.component.html',
  styleUrl: './steam-insight-search.component.scss',
})
export class SteamInsightSearchComponent {
  private steamInsightService = inject(SteamInsightSearchService);
  private steamInsightHistoryService = inject(SteamInsightHistoryService);

  readonly searchForm = this.steamInsightService.searchForm;

  readonly steamGames = this.steamInsightService.steamGames;
  readonly pageLength = this.steamInsightService.pageLength;
  readonly pageIndex = this.steamInsightService.pageIndex;

  readonly loadingState = this.steamInsightService.loadingState;

  readonly steamGameHistory = this.steamInsightHistoryService.steamGameHistory;

  @ViewChild('steamGamePaginator') steamGamePaginator!: MatPaginator;

  onSetPage() {
    this.steamInsightService.setPage(this.steamGamePaginator.pageIndex);
  }

  onResetFilter() {
    this.steamInsightService.resetSearch();
  }

  onRemoveAppFromHistory(app: SteamGameHistoryEntry) {
    this.steamInsightHistoryService.removeApp(app);
  }
}
