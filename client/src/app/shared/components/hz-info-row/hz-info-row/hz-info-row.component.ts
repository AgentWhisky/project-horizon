import { Component } from '@angular/core';

import { MatIconModule } from '@angular/material/icon';

import { HzInfoLabelComponent } from '../hz-info-label/hz-info-label.component';
import { HzInfoValueComponent } from '../hz-info-value/hz-info-value.component';
import { HzInfoActionsComponent } from '../hz-info-actions/hz-info-actions.component';

@Component({
  selector: 'hz-info-row',
  imports: [MatIconModule, HzInfoLabelComponent, HzInfoValueComponent, HzInfoActionsComponent],
  templateUrl: './hz-info-row.component.html',
  styleUrl: './hz-info-row.component.scss',
})
export class HzInfoRowComponent {}
