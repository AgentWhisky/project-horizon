import { Component, input } from '@angular/core';
import { DlcDetails } from '../steam-insight-detail';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'hz-steam-dlc-tile',
  imports: [RouterModule],
  templateUrl: './steam-dlc-tile.component.html',
  styleUrl: './steam-dlc-tile.component.scss',
})
export class SteamDlcTileComponent {
  readonly dlc = input.required<DlcDetails>();
}
