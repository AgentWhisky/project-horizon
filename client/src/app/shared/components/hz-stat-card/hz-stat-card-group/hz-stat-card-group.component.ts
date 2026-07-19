import { booleanAttribute, Component, HostBinding, input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'hz-stat-card-group',
  imports: [],
  templateUrl: './hz-stat-card-group.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './hz-stat-card-group.component.scss',
})
export class HzStatCardGroupComponent {
  readonly showBorder = input(false, { transform: booleanAttribute });
  readonly showPrimaryHeader = input(false, { transform: booleanAttribute });

  @HostBinding('class.with-border')
  get hasBorder() {
    return this.showBorder();
  }

  @HostBinding('class.primary-header')
  get hasPrimaryHeader() {
    return this.showPrimaryHeader();
  }
}
