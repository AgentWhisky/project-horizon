import { NgModule } from '@angular/core';
import { HzTimelineComponent } from './hz-timeline/hz-timeline.component';
import { HzTimelineItemComponent } from './hz-timeline-item/hz-timeline-item.component';
import { HzTimelineHeaderComponent } from './hz-timeline-header/hz-timeline-header.component';
import { HzTimelineMetaComponent } from './hz-timeline-meta/hz-timeline-meta.component';
import { HzTimelineBodyComponent } from './hz-timeline-body/hz-timeline-body.component';

@NgModule({
  imports: [
    HzTimelineComponent,
    HzTimelineItemComponent,
    HzTimelineHeaderComponent,
    HzTimelineMetaComponent,
    HzTimelineBodyComponent,
  ],
  exports: [
    HzTimelineComponent,
    HzTimelineItemComponent,
    HzTimelineHeaderComponent,
    HzTimelineMetaComponent,
    HzTimelineBodyComponent,
  ],
})
export class HzTimelineModule {}
