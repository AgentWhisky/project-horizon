import { Component, input } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { SteamGameSummary } from '../steam-insight';

@Component({
  selector: 'hz-steam-game-tile',
  imports: [MatChipsModule],
  templateUrl: './steam-game-tile.component.html',
  styleUrl: './steam-game-tile.component.scss',
})
export class SteamGameTileComponent {
  readonly steamGame = input.required<SteamGameSummary>();
}
