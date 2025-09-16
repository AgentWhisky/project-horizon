import { NgModule } from '@angular/core';

import { HzCardComponent } from './hz-card/hz-card.component';
import { HzCardHeaderComponent } from './hz-card-header/hz-card-header.component';
import { HzCardChipComponent } from './hz-card-chip/hz-card-chip.component';
import { HzCardBodyComponent } from './hz-card-body/hz-card-body.component';
import { HzChipModule } from '../hz-chip';

@NgModule({
  imports: [HzCardComponent, HzCardHeaderComponent, HzCardChipComponent, HzCardBodyComponent, HzChipModule],
  exports: [HzCardComponent, HzCardHeaderComponent, HzCardChipComponent, HzCardBodyComponent, HzChipModule],
})
export class HzCardModule {}
