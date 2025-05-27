import { Component, inject, model, OnInit, ViewChild } from '@angular/core';
import { SteamInsightSearchService } from './steam-insight-search.service';
import { SteamGameTileComponent } from './steam-game-tile/steam-game-tile.component';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { SelectedApp } from './steam-insight-search';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'hz-steam-insight-search',
  imports: [
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatPaginatorModule,
    MatChipsModule,
    MatTooltipModule,
    RouterModule,
    FormsModule,
    SteamGameTileComponent,
  ],
  templateUrl: './steam-insight-search.component.html',
  styleUrl: './steam-insight-search.component.scss',
})
export class SteamInsightSearchComponent implements OnInit {
  private steamInsightService = inject(SteamInsightSearchService);

  readonly steamGames = this.steamInsightService.steamGames;
  readonly pageLength = this.steamInsightService.pageLength;
  readonly pageIndex = this.steamInsightService.pageIndex;
  readonly searchHistory = this.steamInsightService.searchHistory;

  readonly steamGameSearch = model<string>('');

  @ViewChild('steamGamePaginator') steamGamePaginator!: MatPaginator;

  ngOnInit() {
    this.steamGameSearch.set(this.steamInsightService.currentSearch());
    this.steamInsightService.initalLoad();
  }

  onSearch() {
    this.steamInsightService.search(this.steamGameSearch());
  }

  onChipSearch(app: SelectedApp) {
    this.steamGameSearch.set(app.name);
    this.onSearch();
  }

  onSetPage() {
    this.steamInsightService.setPage(this.steamGamePaginator.pageIndex);
  }

  onResetFilter() {
    this.steamGameSearch.set('');
    this.onSearch();
  }

  // *** SEARCH HISTORY FUNCTIONS ***
  onSelectApp(selectedApp: SelectedApp) {
    this.steamInsightService.addSelectedApp(selectedApp);
  }

  onRemoveAppFromHistory(selectedApp: SelectedApp) {
    this.steamInsightService.removeSelectedApp(selectedApp);
  }

  onClearSearchHistory() {
    this.steamInsightService.clearSearchHistory();
  }
}
