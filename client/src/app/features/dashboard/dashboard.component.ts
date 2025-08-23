import { Component } from '@angular/core';

import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

import { dashboardSections } from './dashboard.config';
import { MatDividerModule } from '@angular/material/divider';
import { ContentTileComponent } from '@hz/shared/components';

@Component({
  selector: 'hz-dashboard',
  imports: [MatButtonModule, MatIconModule, MatCardModule, MatDividerModule, RouterModule, ContentTileComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  readonly dashboardSections = dashboardSections;


}
