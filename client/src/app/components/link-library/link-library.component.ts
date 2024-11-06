import { Component, OnInit } from '@angular/core';

import { MatInputModule } from '@angular/material/input';
import { LinkLibraryService } from './link-library.service';

@Component({
  selector: 'app-link-library',
  standalone: true,
  templateUrl: './link-library.component.html',
  styleUrl: './link-library.component.scss',
  imports: [MatInputModule],
})
export class LinkLibraryComponent implements OnInit {
  constructor(private linkLibraryService: LinkLibraryService) {}

  ngOnInit() {
    this.linkLibraryService.loadLibraryLinks();
  }
}
