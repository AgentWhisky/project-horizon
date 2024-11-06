import { Component, OnInit } from '@angular/core';

import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { LinkLibraryService } from './link-library.service';

@Component({
  selector: 'app-link-library',
  standalone: true,
  templateUrl: './link-library.component.html',
  styleUrl: './link-library.component.scss',
  imports: [MatInputModule, MatCardModule, MatButtonModule],
})
export class LinkLibraryComponent implements OnInit {
  readonly linksByCategory = this.linkLibraryService.linksByCategory;

  constructor(private linkLibraryService: LinkLibraryService) {}

  ngOnInit() {
    this.linkLibraryService.loadLibraryLinks();
  }
}
