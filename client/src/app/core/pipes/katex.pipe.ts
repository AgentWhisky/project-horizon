import { inject, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import katex from 'katex';

@Pipe({
  name: 'katex',
})
export class KatexPipe implements PipeTransform {
  private domSanitizer = inject(DomSanitizer);

  transform(latex: string, displayMode = false): SafeHtml {
    if (!latex) {
      return '';
    }

    try {
      const renderedLatex = katex.renderToString(latex, {
        throwOnError: false,
        displayMode,
        output: 'html',
      });

      return this.domSanitizer.bypassSecurityTrustHtml(renderedLatex);
    } catch {
      return this.domSanitizer.sanitize(1, latex) ?? '';
    }
  }
}
