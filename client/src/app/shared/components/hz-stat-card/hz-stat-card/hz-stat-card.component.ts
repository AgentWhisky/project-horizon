import { booleanAttribute, Component, HostBinding, input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'hz-stat-card',
  imports: [],
  templateUrl: './hz-stat-card.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './hz-stat-card.component.scss',
})
export class HzStatCardComponent {
  readonly showPrimaryHeader = input(false, { transform: booleanAttribute });

  @HostBinding('class.primary-header')
  get hasPrimaryHeader() {
    return this.showPrimaryHeader();
  }
}
