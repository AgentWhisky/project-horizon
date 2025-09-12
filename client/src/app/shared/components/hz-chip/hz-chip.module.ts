import { NgModule } from '@angular/core';

import { HzChipSetComponent } from './hz-chip-set/hz-chip-set.component';
import { HzChipComponent } from './hz-chip/hz-chip.component';

@NgModule({
  imports: [HzChipSetComponent, HzChipComponent],
  exports: [HzChipSetComponent, HzChipComponent],
})
export class HzChipModule {}
