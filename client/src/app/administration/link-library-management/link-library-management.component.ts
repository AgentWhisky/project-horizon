import { Component, effect, OnInit, viewChild } from '@angular/core';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { LinkLibraryService } from '../../services/link-library.service';
import { Link, LinkTag } from '../../types/link-library';
import { MatDialog } from '@angular/material/dialog';
import { LinkLibraryManagementDialogComponent } from './link-library-management-dialog/link-library-management-dialog.component';
import { filter, pipe, tap } from 'rxjs';
import { RemoveConfirmComponent } from '../../dialogs/remove-confirm/remove-confirm.component';

@Component({
  selector: 'app-link-library-management',
  imports: [MatTableModule, MatSortModule, MatPaginatorModule, MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './link-library-management.component.html',
  styleUrl: './link-library-management.component.scss',
})
export class LinkLibraryManagementComponent implements OnInit {
  readonly matSort = viewChild(MatSort);
  readonly matPaginator = viewChild(MatPaginator);

  readonly displayedColumns: string[] = ['id', 'name', 'description', 'url', 'tags', 'actions'];
  readonly dataSource = new MatTableDataSource<Link>();

  constructor(private linkLibraryService: LinkLibraryService, private dialog: MatDialog) {
    effect(() => {
      this.dataSource.data = this.linkLibraryService.links();
    });

    effect(() => {
      this.dataSource.sort = this.matSort() ?? null;
      this.dataSource.paginator = this.matPaginator() ?? null;
    });
  }

  ngOnInit() {
    this.linkLibraryService.loadLibraryLinks();
    this.linkLibraryService.loadLinkCategories();
    this.linkLibraryService.loadLinkTags();
  }

  onCreateLink() {
    this.dialog
      .open(LinkLibraryManagementDialogComponent, {
        data: { type: 'create' },
        height: '65%',
        width: '560px',
      })
      .afterClosed()
      .pipe(tap((result) => console.log(result)))
      .subscribe();
  }

  onEditLink(link: Link) {
    this.dialog
      .open(LinkLibraryManagementDialogComponent, {
        data: { type: 'update', link },
        height: '65%',
        width: '560px',
      })
      .afterClosed()
      .pipe(
        filter((result) => result && result.status === true),
        tap((result) => this.linkLibraryService.updateLink({ id: link.id, ...result.linkData }))
      )
      .subscribe();
  }

  onDeleteLink(link: Link) {
    const message = 'Are you sure you want to remove this link?';
    const metaData = `${link.name} - ${link.url}`;

    this.dialog
      .open(RemoveConfirmComponent, { data: { message, metaData } })
      .afterClosed()
      .pipe(
        filter((result) => result),
        tap(() => this.linkLibraryService.removeLink(link.id))
      )
      .subscribe();
  }

  getTagsFormatted(linkTags: LinkTag[]) {
    return linkTags.map((tag) => tag.name).join(', ');
  }
}
