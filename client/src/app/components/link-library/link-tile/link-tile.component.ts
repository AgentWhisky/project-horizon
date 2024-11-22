import { Component, input } from '@angular/core';
import { LinksByCategory } from '../link-library';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-link-tile',
  standalone: true,
  templateUrl: './link-tile.component.html',
  styleUrl: './link-tile.component.scss',
  imports: [MatButtonModule, MatIconModule],
})
export class LinkTileComponent {
  readonly linksByCategory = input.required<LinksByCategory>();
}
