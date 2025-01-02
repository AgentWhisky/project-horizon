import { Component, effect, model, OnInit } from '@angular/core';
import { LinkLibraryService } from './link-library.service';

import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';

import { LinkLibraryDialogComponent } from './link-library-dialog/link-library-dialog.component';
import { Link } from './link-library';

@Component({
  selector: 'app-link-library',
  imports: [MatButtonModule, MatInputModule, MatIconModule, MatCardModule, ReactiveFormsModule],
  templateUrl: './link-library.component.html',
  styleUrl: './link-library.component.scss',
})
export class LinkLibraryComponent implements OnInit {
  readonly linksByCategory = this.linkLibraryService.linksByCategory;
  readonly filterForm = this.linkLibraryService.filterForm;

  constructor(private linkLibraryService: LinkLibraryService, private dialog: MatDialog) {}

  ngOnInit() {
    this.linkLibraryService.loadLibraryLinks();
  }

  onResetForm() {
    this.linkLibraryService.resetForm();
  }

  onOpenInfo(link: Link) {
    const dialogRef = this.dialog.open(LinkLibraryDialogComponent, { data: { link } });
  }
}
