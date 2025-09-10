import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import { HzStatCardModule } from '@hz/shared/components';

import { MOCK_STATS } from './test-stat-card.mock';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'hz-test-stat-card',
  imports: [MatButtonModule, MatIconModule, RouterModule, HzStatCardModule],
  templateUrl: './test-stat-card.component.html',
  styleUrl: './test-stat-card.component.scss',
})
export class TestStatCardComponent {
  readonly mockData = MOCK_STATS;
}
