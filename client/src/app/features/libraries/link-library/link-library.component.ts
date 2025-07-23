import { Component, computed, effect, inject, model, OnInit, viewChildren } from '@angular/core';
import { LinkLibraryService } from './link-library.service';

import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { LinkTileComponent } from './link-tile/link-tile.component';
import { FormsModule } from '@angular/forms';
import { StatusBannerComponent } from '../../../shared/components/status-banner/status-banner.component';
import { cardAnimation } from '../../../core/animations/card.animation';

@Component({
  selector: 'hz-link-library',
  imports: [
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatCardModule,
    MatAutocompleteModule,
    FormsModule,
    LinkTileComponent,
    StatusBannerComponent,
  ],
  templateUrl: './link-library.component.html',
  styleUrl: './link-library.component.scss',
  animations: [cardAnimation],
})
export class LinkLibraryComponent implements OnInit {
  private linkLibraryService = inject(LinkLibraryService);

  readonly links = this.linkLibraryService.links;
  readonly linkFilter = model<string>('');
  readonly filteredLinks = computed(() => this.onFilterLinks());
  readonly linksByCategory = computed(() => this.linkLibraryService.getLinksByCategory(this.filteredLinks()));

  private linkTiles = viewChildren(LinkTileComponent);

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

  onFilterLinks() {
    const filter = this.linkFilter()?.trim()?.toLowerCase();
    if (!filter) {
      return this.links();
    }

    return this.links().filter(
      (link) =>
        link.name?.toLowerCase().includes(filter) ||
        link.category.name?.toLowerCase().includes(filter) ||
        link.tags.some((tag) => tag.name?.toLowerCase().includes(filter))
    );
  }
}
