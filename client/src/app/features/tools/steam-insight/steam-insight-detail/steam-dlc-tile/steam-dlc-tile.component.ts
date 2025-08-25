import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ASSET_URLS } from '@hz/core/constants';

import { DlcDetails } from '../steam-insight-detail';

@Component({
  selector: 'hz-steam-dlc-tile',
  imports: [RouterModule],
  templateUrl: './steam-dlc-tile.component.html',
  styleUrl: './steam-dlc-tile.component.scss',
})
export class SteamDlcTileComponent {
  readonly dlc = input.required<DlcDetails>();

  readonly headerImagePlaceholder = ASSET_URLS.IMAGES.STEAM_HEADER_IMAGE_PLACEHOLDER;
}
