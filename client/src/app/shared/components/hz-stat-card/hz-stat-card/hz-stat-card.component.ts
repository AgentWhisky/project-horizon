import { booleanAttribute, Component, HostBinding, input } from '@angular/core';

@Component({
  selector: 'hz-stat-card',
  imports: [],
  templateUrl: './hz-stat-card.component.html',
  styleUrl: './hz-stat-card.component.scss',
})
export class HzStatCardComponent {
  readonly showPrimaryHeader = input(false, { transform: booleanAttribute });

  @HostBinding('class.primary-header')
  get hasPrimaryHeader() {
    return this.showPrimaryHeader();
  }
}
