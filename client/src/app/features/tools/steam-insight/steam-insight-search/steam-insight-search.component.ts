import { Component, inject, model, OnInit, ViewChild } from '@angular/core';
import { SteamInsightSearchService } from './steam-insight-search.service';
import { SteamGameTileComponent } from './steam-game-tile/steam-game-tile.component';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { SteamGameHistoryEntry } from '../steam-insight';
import { SteamInsightHistoryService } from '../steam-insight-history.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { KeywordPipe } from '../../../../core/pipes/keyword.pipe';

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
    RouterModule,
    FormsModule,
    SteamGameTileComponent,
    KeywordPipe,
  ],
  templateUrl: './steam-insight-search.component.html',
  styleUrl: './steam-insight-search.component.scss',
})
export class SteamInsightSearchComponent implements OnInit {
  private steamInsightService = inject(SteamInsightSearchService);
  private steamInsightHistoryService = inject(SteamInsightHistoryService);

  readonly gameSearchInput = this.steamInsightService.gameSearchInput;
  readonly activeSearchQuery = this.steamInsightService.activeSearchQuery;

  readonly steamGames = this.steamInsightService.steamGames;
  readonly pageLength = this.steamInsightService.pageLength;
  readonly pageIndex = this.steamInsightService.pageIndex;

  readonly loadingNotLoaded = this.steamInsightService.loadingNotLoaded;
  readonly loadingInProgress = this.steamInsightService.loadingInProgress;
  readonly loadingSuccess = this.steamInsightService.loadingSuccess;
  readonly loadingFailure = this.steamInsightService.loadingFailure;

  readonly steamGameHistory = this.steamInsightHistoryService.steamGameHistory;

  @ViewChild('steamGamePaginator') steamGamePaginator!: MatPaginator;

  ngOnInit() {
    if (this.loadingNotLoaded()) {
      this.steamInsightService.search();
    }
  }

  onSearch() {
    this.steamInsightService.search();
  }

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
