import { Component } from '@angular/core';
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
import { LoginService } from '../../services/login.service';

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
  readonly isLeftNavOpen = this.navigationService.isLeftNavOpen;
  readonly isSmallScreen = this.navigationService.isSmallScreen;
  readonly isLoggedIn = this.loginService.isLoggedIn;
  readonly isDarkmode = this.themeService.isDarkTheme;
  constructor(private navigationService: NavigationService, private loginService: LoginService, private themeService: ThemeService) {}

  onToggleLeftNav() {
    this.navigationService.toggleLeftNav();
  }

  onCloseLeftNav() {
    this.navigationService.closeLeftNav();
  }

  onLogState() {
    if (this.isLoggedIn()) {
      this.loginService.logout();
    } else {
      this.loginService.login();
    }
  }

  onToggleTheme() {
    this.themeService.toggleTheme();
  }
}
