import { Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-no-data-card',
  imports: [MatButtonModule, MatCardModule],
  templateUrl: './no-data-card.component.html',
  styleUrl: './no-data-card.component.scss',
})
export class NoDataCardComponent {
  readonly message = input.required<string>();
}
