import { NgModule } from '@angular/core';

import { HzStatCardGroupComponent } from './hz-stat-card-group/hz-stat-card-group.component';
import { HzStatCardComponent } from './hz-stat-card/hz-stat-card.component';
import { HzStatCardTitleComponent } from './hz-stat-card-title/hz-stat-card-title.component';
import { HzStatCardValueComponent } from './hz-stat-card-value/hz-stat-card-value.component';

@NgModule({
  imports: [HzStatCardGroupComponent, HzStatCardComponent, HzStatCardTitleComponent, HzStatCardValueComponent],
  exports: [HzStatCardGroupComponent, HzStatCardComponent, HzStatCardTitleComponent, HzStatCardValueComponent],
})
export class HzStatCardModule {}
