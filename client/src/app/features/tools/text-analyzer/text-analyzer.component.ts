import { Component, computed, effect, inject, model, OnInit, viewChild } from '@angular/core';

import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { getCharacterCount, getWordCount } from '../../../core/utilities/text.util';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { CharacterBreakdown } from '../../../core/types/text.type';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'hz-text-analyzer',
  imports: [
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatTableModule,
    MatSortModule,
    MatSlideToggleModule,
    MatDividerModule,
    FormsModule,
  ],
  templateUrl: './text-analyzer.component.html',
  styleUrl: './text-analyzer.component.scss',
})
export class TextAnalyzerComponent implements OnInit {
  private snackbar = inject(MatSnackBar);

  readonly textInput = model<string>('');
  readonly caseSensitive = model<boolean>(true);

  readonly characterBreakdown = computed(() => getCharacterCount(this.textInput(), this.caseSensitive()));
  readonly characterCount = computed(() => this.textInput().length);
  readonly wordCount = computed(() => getWordCount(this.textInput()));

  // Character Table
  readonly charBreakdownSort = viewChild<MatSort>('charBreakdownSort');
  readonly charBreakdownDisplayedColumns: string[] = ['character', 'count', 'percent'];
  readonly charBreakdownDataSource = new MatTableDataSource<CharacterBreakdown>();

  constructor() {
    effect(() => {
      this.charBreakdownDataSource.data = this.characterBreakdown();
    });

    effect(() => {
      this.charBreakdownDataSource.sort = this.charBreakdownSort() ?? null;
    });
  }

  ngOnInit() {
    this.textInput.set('');
    this.caseSensitive.set(true);
  }

  onResetTextInput() {
    this.textInput.set('');
  }

  onCopyTextInput() {
    navigator.clipboard
      .writeText(this.textInput())
      .then(() => {
        this.snackbar.open(`Successfully copied to clipboard`, 'Close', { duration: 3000 });
      })
      .catch(() => {
        this.snackbar.open(`Failed to copy to clipboard`, 'Close', { duration: 3000 });
      });
  }
}
