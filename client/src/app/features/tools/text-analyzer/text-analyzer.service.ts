import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { analyzeText } from './text-analyzer.utils';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class TextAnalyzerService {
  private snackbar = inject(MatSnackBar);

  readonly textInput = signal<string>('');
  readonly timeEstimateAnalytics = signal<boolean>(false);
  readonly contentQualityAnalytics = signal<boolean>(false);
  readonly readabilityAnalytics = signal<boolean>(false);

  readonly hasTextInput = computed(() => !!this.textInput());
  readonly textBreakdown = computed(() => this.runAnalyzeText());

  constructor() {
    //effect(() => console.log('TEST BREAKDOWN', this.textBreakdown()));
    //effect(() => console.log('INPUT', this.textInput()));
  }

  resetTextInput() {
    this.textInput.set('');
  }

  copyTextInput() {
    navigator.clipboard
      .writeText(this.textInput())
      .then(() => {
        this.snackbar.open(`Successfully copied to clipboard`, 'Close', { duration: 3000 });
      })
      .catch(() => {
        this.snackbar.open(`Failed to copy to clipboard`, 'Close', { duration: 3000 });
      });
  }

  // *** PRIVATE FUNCTIONS ***
  private runAnalyzeText() {
    return analyzeText(this.textInput(), {
      timeEstimateAnalytics: this.timeEstimateAnalytics(),
      contentQualityAnalytics: this.contentQualityAnalytics(),
      readabilityAnalytics: this.readabilityAnalytics(),
    });
  }
}
