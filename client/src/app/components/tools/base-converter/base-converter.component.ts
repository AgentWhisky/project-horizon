import { Component } from '@angular/core';
import { BaseConvertTileComponent } from "./base-convert-tile/base-convert-tile.component";

@Component({
  selector: 'app-base-converter',
  imports: [BaseConvertTileComponent],
  templateUrl: './base-converter.component.html',
  styleUrl: './base-converter.component.scss'
})
export class BaseConverterComponent {
  readonly bases = [10, 16, 8, 2]
}
