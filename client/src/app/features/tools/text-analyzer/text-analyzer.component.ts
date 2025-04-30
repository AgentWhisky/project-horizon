import { Component, effect, inject, viewChild } from '@angular/core';

import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TextAnalyzerService } from './text-analyzer.service';
import { CharacterBreakdown, WordBreakdown } from './text-analyzer';
import { TimeFormatPipe } from '../../../core/pipes/time-format.pipe';
import { CommonModule } from '@angular/common';

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
    ReactiveFormsModule,
    FormsModule,
    TimeFormatPipe,
    CommonModule,
  ],
  templateUrl: './text-analyzer.component.html',
  styleUrl: './text-analyzer.component.scss',
})
export class TextAnalyzerComponent {
  private textAnalyzerService = inject(TextAnalyzerService);

  readonly textInput = this.textAnalyzerService.textInput;
  readonly timeEstimateAnalytics = this.textAnalyzerService.timeEstimateAnalytics;
  readonly contentQualityAnalytics = this.textAnalyzerService.contentQualityAnalytics;
  readonly readabilityAnalytics = this.textAnalyzerService.readabilityAnalytics;

  readonly hasTextInput = this.textAnalyzerService.hasTextInput;
  readonly textBreakdown = this.textAnalyzerService.textBreakdown;

  // Character Table
  readonly charBreakdownSort = viewChild<MatSort>('charBreakdownSort');
  readonly charBreakdownDisplayedColumns: string[] = ['character', 'count', 'percent'];
  readonly charBreakdownDataSource = new MatTableDataSource<CharacterBreakdown>();

  // Word Table
  readonly wordBreakdownSort = viewChild<MatSort>('wordBreakdownSort');
  readonly wordBreakdownDisplayedColumns: string[] = ['word', 'count', 'percent'];
  readonly wordBreakdownDataSource = new MatTableDataSource<WordBreakdown>();

  constructor() {
    effect(() => {
      this.charBreakdownDataSource.data = this.textBreakdown().characterBreakdown;
    });

    effect(() => {
      this.charBreakdownDataSource.sort = this.charBreakdownSort() ?? null;
    });

    effect(() => {
      this.wordBreakdownDataSource.data = this.textBreakdown().wordBreakdown;
    });

    effect(() => {
      this.wordBreakdownDataSource.sort = this.wordBreakdownSort() ?? null;
    });
  }

  onResetTextInput() {
    this.textAnalyzerService.resetTextInput();
  }

  onCopyTextInput() {
    this.textAnalyzerService.copyTextInput();
  }
}
