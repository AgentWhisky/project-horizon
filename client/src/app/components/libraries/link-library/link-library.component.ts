import { Component, effect, inject, model, OnInit, viewChildren } from '@angular/core';
import { LinkLibraryService } from './link-library.service';

import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { LinkTileComponent } from './link-tile/link-tile.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-link-library',
  imports: [MatButtonModule, MatInputModule, MatIconModule, MatCardModule, MatAutocompleteModule, FormsModule, LinkTileComponent],
  templateUrl: './link-library.component.html',
  styleUrl: './link-library.component.scss',
})
export class LinkLibraryComponent implements OnInit {
  private linkLibraryService = inject(LinkLibraryService);
  readonly linksByCategory = this.linkLibraryService.linksByCategory;

  readonly linkFilter = model<string>('');

  private linkTiles = viewChildren(LinkTileComponent);

  constructor() {
    effect(() => console.log(this.linkFilter()));
  }

  ngOnInit() {
    this.linkLibraryService.loadLibraryLinks();
  }

  onResetFilter() {
    this.linkFilter.set('');
  }

  onExapndAll() {
    this.linkTiles().forEach((tile) => tile.onOpenView());
  }

  onCollapseAll() {
    this.linkTiles().forEach((tile) => tile.onCloseView());
  }
}
