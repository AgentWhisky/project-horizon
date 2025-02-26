import { Component, inject } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { AuthenticationService } from '../../../services/authentication.service';

@Component({
  selector: 'app-button-triggers',
  imports: [MatButtonModule, MatIconModule, MatCardModule],
  templateUrl: './button-triggers.component.html',
  styleUrl: './button-triggers.component.scss',
})
export class ButtonTriggersComponent {
  private authService = inject(AuthenticationService);

  onTestLogin() {
    this.authService.login({ username: 'TestUser', password: '0818' });
  }
}
