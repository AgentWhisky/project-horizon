import { Component, inject } from '@angular/core';

import { RouterModule } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-left-nav',
  imports: [RouterModule, MatButtonModule, MatIconModule, MatDividerModule],
  templateUrl: './left-nav.component.html',
  styleUrl: './left-nav.component.scss',
})
export class LeftNavComponent {
  private authService = inject(AuthenticationService);
  readonly isLoggedIn = this.authService.isLoggedIn;
}
