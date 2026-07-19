import { Component, input, ChangeDetectionStrategy } from '@angular/core';

import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'hz-timeline-item',
  imports: [MatIconModule],
  templateUrl: './hz-timeline-item.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './hz-timeline-item.component.scss',
})
export class HzTimelineItemComponent {
  readonly latest = input<boolean>(false);
}
