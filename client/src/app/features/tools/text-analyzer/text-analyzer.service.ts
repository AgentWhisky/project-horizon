import { computed, inject, Injectable, signal } from '@angular/core';

import { MatSnackBar } from '@angular/material/snack-bar';

import { analyzeText } from './text-analyzer.utils';

@Injectable({
  providedIn: 'root',
})
export class TextAnalyzerService {
  private snackbar = inject(MatSnackBar);

  readonly textInput = signal<string>('');
  readonly timeEstimateAnalytics = signal<boolean>(true);
  readonly contentQualityAnalytics = signal<boolean>(true);
  readonly readabilityAnalytics = signal<boolean>(true);

  readonly hasTextInput = computed(() => !!this.textInput());
  readonly textBreakdown = computed(() => this.runAnalyzeText());

  resetTextInput() {
    try {
      this.textInput.set('');
      this.snackbar.open(`Successfully cleared text input`, 'Close', { duration: 3000 });
    } catch (error) {
      this.snackbar.open(`Failed to clear text input`, 'Close', { duration: 3000 });
    }
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
