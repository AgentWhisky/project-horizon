import { Component, inject, OnInit } from '@angular/core';
import { LinkLibraryService } from './link-library.service';

import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';

import { LinkTileComponent } from './link-tile/link-tile.component';

@Component({
  selector: 'app-link-library',
  imports: [MatButtonModule, MatInputModule, MatIconModule, MatCardModule, ReactiveFormsModule, LinkTileComponent],
  templateUrl: './link-library.component.html',
  styleUrl: './link-library.component.scss',
})
export class LinkLibraryComponent implements OnInit {
  private linkLibraryService = inject(LinkLibraryService);
  readonly linksByCategory = this.linkLibraryService.linksByCategory;
  readonly filterForm = this.linkLibraryService.filterForm;

  ngOnInit() {
    this.linkLibraryService.loadLibraryLinks();
  }

  onResetForm() {
    this.linkLibraryService.resetForm();
  }
}
