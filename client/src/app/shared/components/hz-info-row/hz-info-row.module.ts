import { NgModule } from '@angular/core';

import { HzInfoRowComponent } from './hz-info-row/hz-info-row.component';
import { HzInfoLabelComponent } from './hz-info-label/hz-info-label.component';
import { HzInfoValueComponent } from './hz-info-value/hz-info-value.component';
import { HzInfoActionsComponent } from './hz-info-actions/hz-info-actions.component';
import { HzInfoActionsDirective } from './hz-info-actions/hz-info-actions.directive';

@NgModule({
  imports: [HzInfoRowComponent, HzInfoLabelComponent, HzInfoValueComponent, HzInfoActionsComponent, HzInfoActionsDirective],
  exports: [HzInfoRowComponent, HzInfoLabelComponent, HzInfoValueComponent, HzInfoActionsComponent, HzInfoActionsDirective],
})
export class HzInfoRowModule {}
