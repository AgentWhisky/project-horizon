import { Component, inject, input, output } from '@angular/core';
import { ContentTileConfig } from './content-tile';
import { RouterModule } from '@angular/router';
import { ThemeService } from '@hz/core/services';


@Component({
  selector: 'hz-content-tile',
  imports: [RouterModule],
  templateUrl: './content-tile.component.html',
  styleUrl: './content-tile.component.scss',
})
export class ContentTileComponent {
  readonly themeService = inject(ThemeService);

  readonly contentTileConfig = input.required<ContentTileConfig>();
  readonly tileClicked = output<number>();

  onClickTile() {
    this.tileClicked.emit(this.contentTileConfig().id);
  }

  onImgError() {
    return 'assets/images/horizon-placeholder.png';
  }
}
