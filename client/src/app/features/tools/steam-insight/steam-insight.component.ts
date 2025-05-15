import { Component, inject, model, OnInit, viewChild } from '@angular/core';
import { StatusBannerComponent } from '../../../shared/components/status-banner/status-banner.component';
import { SteamInsightService } from './steam-insight.service';
import { SteamGameTileComponent } from './steam-game-tile/steam-game-tile.component';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'hz-steam-insight',
  imports: [MatInputModule, MatIconModule, MatPaginatorModule, FormsModule, StatusBannerComponent, SteamGameTileComponent],
  templateUrl: './steam-insight.component.html',
  styleUrl: './steam-insight.component.scss',
})
export class SteamInsightComponent implements OnInit {
  private steamInsightService = inject(SteamInsightService);

  readonly steamGames = this.steamInsightService.steamGames;
  readonly pageSettings = this.steamInsightService.pageSettings;

  readonly steamGameSearch = model<string>('');
  readonly steamGamePaginator = viewChild<MatPaginator>('steamGamePaginator');

  ngOnInit() {
    this.steamInsightService.loadSteamGames();
  }

  onSearch() {
    this.steamInsightService.loadSteamGames({
      search: this.steamGameSearch(),
      pageIndex: this.steamGamePaginator()?.pageIndex ?? 0,
      pageSize: 20,
    });
  }

  onResetFilter() {
    this.steamGameSearch.set('');
  }
}
