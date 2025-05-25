import { Component, inject, input, output } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { SteamGameSummary, SelectedApp } from '../steam-insight-search';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'hz-steam-game-tile',
  imports: [MatChipsModule, RouterModule],
  templateUrl: './steam-game-tile.component.html',
  styleUrl: './steam-game-tile.component.scss',
})
export class SteamGameTileComponent {
  readonly router = inject(Router);

  readonly steamGame = input.required<SteamGameSummary>();

  readonly selectedApp = output<SelectedApp>();

  onSelectApp() {
    this.selectedApp.emit({ appid: this.steamGame().appid, name: this.steamGame().name });
  }
}
