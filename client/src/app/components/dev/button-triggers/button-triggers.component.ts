import { Component, inject } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-button-triggers',
  imports: [MatButtonModule, MatIconModule, MatCardModule],
  templateUrl: './button-triggers.component.html',
  styleUrl: './button-triggers.component.scss',
})
export class ButtonTriggersComponent {
  private userService = inject(UserService);

  onTestLogin() {
    this.userService.login({ username: 'TestUser', password: '0818' });
  }
}
