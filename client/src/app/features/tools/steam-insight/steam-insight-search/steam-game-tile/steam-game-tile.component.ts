import { Component, inject, input, output } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { SteamGameSummary, SelectedApp } from '../steam-insight-search';
import { Router } from '@angular/router';

@Component({
  selector: 'hz-steam-game-tile',
  imports: [MatChipsModule],
  templateUrl: './steam-game-tile.component.html',
  styleUrl: './steam-game-tile.component.scss',
})
export class SteamGameTileComponent {
  readonly router = inject(Router);

  readonly steamGame = input.required<SteamGameSummary>();

  readonly selectedApp = output<SelectedApp>();

  onSelectApp() {
    this.router.navigate(['/steam-insight', this.steamGame().appid]);
    this.selectedApp.emit({ appid: this.steamGame().appid, name: this.steamGame().name });
  }
}
