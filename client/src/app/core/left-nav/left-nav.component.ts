import { Component, inject } from '@angular/core';

import { RouterModule } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-left-nav',
  imports: [RouterModule, MatButtonModule, MatIconModule, MatDividerModule],
  templateUrl: './left-nav.component.html',
  styleUrl: './left-nav.component.scss',
})
export class LeftNavComponent {
  private userService = inject(UserService);
  readonly isLoggedIn = this.userService.isLoggedIn;
}
