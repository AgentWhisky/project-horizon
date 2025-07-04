import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';

import { ScreenService } from '../../core/services/screen.service';
import { NavigationService } from '../../core/services/navigation.service';
import { UserService } from '../../core/services/user.service';
import { ThemeService } from '../../core/services/theme.service';
import { LeftNavComponent } from '../left-nav/left-nav.component';

@Component({
  selector: 'hz-main',
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
  private screenService = inject(ScreenService);
  private navigationService = inject(NavigationService);
  private userService = inject(UserService);
  private themeService = inject(ThemeService);

  readonly isSmallScreen = this.screenService.isSmallScreen;
  readonly isMobileScreen = this.screenService.isMobileScreen;
  readonly isScrolled = this.screenService.isScrolled;

  readonly isLeftNavOpen = this.navigationService.isLeftNavOpen;
  readonly isLoggedIn = this.userService.isLoggedIn;
  readonly isDarkmode = this.themeService.isDarkTheme;

  onToggleLeftNav() {
    this.navigationService.toggleLeftNav();
  }

  onCloseLeftNav() {
    this.navigationService.closeLeftNav();
  }

  onLogin() {
    this.userService.loginDialog();
  }

  onLogout() {
    this.userService.logout();
  }

  onToggleTheme() {
    this.themeService.toggleTheme();
  }

  onOpenInNewTab(url: string) {
    window.open(url, '_blank', 'noopener');
  }
}
