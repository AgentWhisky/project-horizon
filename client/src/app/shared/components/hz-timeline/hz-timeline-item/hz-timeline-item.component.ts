import { Component, input } from '@angular/core';

import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'hz-timeline-item',
  imports: [MatIconModule],
  templateUrl: './hz-timeline-item.component.html',
  styleUrl: './hz-timeline-item.component.scss',
})
export class HzTimelineItemComponent {
  readonly latest = input<boolean>(false);
}
