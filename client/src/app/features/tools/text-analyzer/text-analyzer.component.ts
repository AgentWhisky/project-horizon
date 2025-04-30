import { Component, computed, effect, inject, model, OnInit, viewChild } from '@angular/core';

import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { getCharacterBreakdown, getWordBreakdown } from '../../../core/utilities/text.util';
import { CharacterCount, WordCount } from '../../../core/types/text.type';
import { analyzeText } from './text-analyzer.utils';

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

  readonly characterBreakdown = computed(() => getCharacterBreakdown(this.textInput(), this.caseSensitive()));
  readonly wordBreakdown = computed(() => getWordBreakdown(this.textInput()));

  readonly textBreakdown = computed(() =>
    analyzeText(this.textInput(), {
      timeEstimateAnalytics: true,
      contentQualityAnalytics: true,
      readabilityAnalytics: true,
    })
  );

  // Character Table
  readonly charBreakdownSort = viewChild<MatSort>('charBreakdownSort');
  readonly charBreakdownDisplayedColumns: string[] = ['character', 'count', 'percent'];
  readonly charBreakdownDataSource = new MatTableDataSource<CharacterCount>();

  // Word Table
  readonly wordBreakdownSort = viewChild<MatSort>('wordBreakdownSort');
  readonly wordBreakdownDisplayedColumns: string[] = ['word', 'count', 'percent'];
  readonly wordBreakdownDataSource = new MatTableDataSource<WordCount>();

  constructor() {
    effect(() => {
      this.charBreakdownDataSource.data = this.characterBreakdown().characterCount;
    });

    effect(() => {
      this.charBreakdownDataSource.sort = this.charBreakdownSort() ?? null;
    });

    effect(() => {
      this.wordBreakdownDataSource.data = this.wordBreakdown().wordCount;
    });

    effect(() => {
      this.wordBreakdownDataSource.sort = this.wordBreakdownSort() ?? null;
    });

    effect(() => console.log('TEXT BREAKDOWN', this.textBreakdown()));
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
