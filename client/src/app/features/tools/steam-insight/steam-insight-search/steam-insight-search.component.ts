import { Component, inject, model, OnInit, signal, ViewChild, viewChild } from '@angular/core';
import { StatusBannerComponent } from '../../../../shared/components/status-banner/status-banner.component';
import { SteamInsightSearchService } from './steam-insight-search.service';
import { SteamGameTileComponent } from './steam-game-tile/steam-game-tile.component';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'hz-steam-insight-search',
  imports: [MatInputModule, MatIconModule, MatPaginatorModule, FormsModule, StatusBannerComponent, SteamGameTileComponent],
  templateUrl: './steam-insight-search.component.html',
  styleUrl: './steam-insight-search.component.scss',
})
export class SteamInsightSearchComponent implements OnInit {
  private steamInsightService = inject(SteamInsightSearchService);

  readonly steamGames = this.steamInsightService.steamGames;
  readonly pageSettings = this.steamInsightService.pageSettings;

  readonly steamGameSearch = model<string>('');
  @ViewChild('steamGamePaginator') steamGamePaginator!: MatPaginator;

  readonly isDirty = signal<boolean>(false);

  ngOnInit() {
    this.steamInsightService.loadSteamGames();
  }

  onSearch() {
    if (this.isDirty()) {
      this.steamGamePaginator.pageIndex = 0;
    }

    this.steamInsightService.loadSteamGames({
      search: this.steamGameSearch(),
      pageIndex: this.steamGamePaginator.pageIndex,
      pageSize: 20,
    });
    this.isDirty.set(false);
  }

  onSearchDirty() {
    this.isDirty.set(true);
  }

  onResetFilter() {
    this.steamGameSearch.set('');
    this.onSearch();
  }
}
