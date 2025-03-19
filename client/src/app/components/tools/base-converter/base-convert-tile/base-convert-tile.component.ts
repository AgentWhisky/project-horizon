import { Component, effect, input, model } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-base-convert-tile',
  imports: [MatInputModule, MatButtonModule, MatCardModule, MatIconModule, FormsModule],
  templateUrl: './base-convert-tile.component.html',
  styleUrl: './base-convert-tile.component.scss',
})
export class BaseConvertTileComponent {
  readonly base = input.required<number>();
  readonly convertInput = model<string>('');

  constructor() {
    effect(() => console.log(`Base: ${this.base()} - ${this.convertInput()}`));
  }
}
