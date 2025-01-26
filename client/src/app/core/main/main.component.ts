import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';

import { LeftNavComponent } from '../left-nav/left-nav.component';

import { NavigationService } from '../../services/navigation.service';
import { ThemeService } from '../../services/theme.service';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
  imports: [
    RouterModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatTooltipModule,
    MatMenuModule,
    LeftNavComponent,
  ],
})
export class MainComponent {
  private navigationService = inject(NavigationService);
  private authService = inject(AuthenticationService);
  private themeService = inject(ThemeService);

  readonly isLeftNavOpen = this.navigationService.isLeftNavOpen;
  readonly isSmallScreen = this.navigationService.isSmallScreen;
  readonly isLoggedIn = this.authService.isLoggedIn;
  readonly isDarkmode = this.themeService.isDarkTheme;

  onToggleLeftNav() {
    this.navigationService.toggleLeftNav();
  }

  onCloseLeftNav() {
    this.navigationService.closeLeftNav();
  }

  onLogState() {
    if (this.isLoggedIn()) {
      this.authService.logout();
    } else {
      this.authService.login();
    }
  }

  onToggleTheme() {
    this.themeService.toggleTheme();
  }
}
