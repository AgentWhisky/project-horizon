import { booleanAttribute, Component, input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'hz-loading-spinner',
  imports: [],
  templateUrl: './hz-loading-spinner.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './hz-loading-spinner.component.scss',
})
export class HzLoadingSpinnerComponent {
  readonly text = input<string>('Loading...');
  readonly showBackground = input(false, { transform: booleanAttribute });
  readonly size = input<number>(48); // Spinner size in px
}
