import { Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'hz-message-card',
  imports: [MatButtonModule, MatCardModule],
  templateUrl: './message-card.component.html',
  styleUrl: './message-card.component.scss',
})
export class MessageCardComponent {
  readonly message = input.required<string>();
}
