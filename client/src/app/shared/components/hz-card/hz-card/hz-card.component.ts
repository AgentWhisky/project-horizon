import { booleanAttribute, Component, input } from '@angular/core';


@Component({
  selector: 'hz-card',
  imports: [],
  templateUrl: './hz-card.component.html',
  styleUrl: './hz-card.component.scss',
})
export class HzCardComponent {
  readonly primary = input(false, { transform: booleanAttribute });
  readonly hideBackground = input(false, { transform: booleanAttribute });
}
