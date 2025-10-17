import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ASSET_URLS } from '@hz/core/constants';

import { SteamGameSummary } from '../steam-insight-search.model';

@Component({
  selector: 'hz-steam-game-tile',
  imports: [RouterModule],
  templateUrl: './steam-game-tile.component.html',
  styleUrl: './steam-game-tile.component.scss',
})
export class SteamGameTileComponent {
  readonly steamGame = input.required<SteamGameSummary>();

  readonly headerImagePlaceholder = ASSET_URLS.IMAGES.STEAM_HEADER_IMAGE_PLACEHOLDER;
}
