import { Component, input } from '@angular/core';

@Component({
  selector: 'hz-content-tile',
  imports: [],
  templateUrl: './content-tile.component.html',
  styleUrl: './content-tile.component.scss'
})
export class ContentTileComponent {
  readonly content = input.required()
}
