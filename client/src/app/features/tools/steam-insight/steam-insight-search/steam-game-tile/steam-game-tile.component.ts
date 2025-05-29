import { Component, inject, input } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { SteamGameSummary } from '../steam-insight-search';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'hz-steam-game-tile',
  imports: [MatChipsModule, RouterModule],
  templateUrl: './steam-game-tile.component.html',
  styleUrl: './steam-game-tile.component.scss',
})
export class SteamGameTileComponent {
  readonly steamGame = input.required<SteamGameSummary>();
}
