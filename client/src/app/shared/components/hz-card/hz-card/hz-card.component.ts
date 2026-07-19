import { booleanAttribute, Component, input, ChangeDetectionStrategy } from '@angular/core';


@Component({
  selector: 'hz-card',
  imports: [],
  templateUrl: './hz-card.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './hz-card.component.scss',
})
export class HzCardComponent {
  readonly primary = input(false, { transform: booleanAttribute });
  readonly hideBackground = input(false, { transform: booleanAttribute });
}
