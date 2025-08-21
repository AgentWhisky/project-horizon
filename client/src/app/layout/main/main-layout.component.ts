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
import { ScrollingModule } from '@angular/cdk/scrolling';
import { environment } from '../../../environments/environment';
import { APP_URLS } from '../../core/constants/url.constant';
import { AppVersionDialogComponent } from '../app-version-dialog/app-version-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { VersionHistoryService } from '../../core/services/version-history.service';

@Component({
  selector: 'hz-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
  imports: [
    RouterModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatTooltipModule,
    MatMenuModule,
    LeftNavComponent,
    ScrollingModule,
  ],
})
export class MainComponent {
  private screenService = inject(ScreenService);
  private navigationService = inject(NavigationService);
  private userService = inject(UserService);
  private themeService = inject(ThemeService);
  private versionHistoryService = inject(VersionHistoryService);

  private dialog = inject(MatDialog);

  readonly isSmallScreen = this.screenService.isSmallScreen;
  readonly isMobileScreen = this.screenService.isMobileScreen;
  readonly isScrolled = this.screenService.isScrolled;

  readonly isLeftNavOpen = this.navigationService.isLeftNavOpen;
  readonly isLoggedIn = this.userService.isLoggedIn;
  readonly isDarkmode = this.themeService.isDarkTheme;

  readonly currentVersionInfo = this.versionHistoryService.currentVersionInfo;
  readonly envName = environment.envName;

  readonly githubUrl = APP_URLS.github;
  readonly githubRepoUrl = APP_URLS.githubRepo;
  readonly linkedInUrl = APP_URLS.linkedIn;

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

  onOpenVersionHistory() {
    this.dialog.open(AppVersionDialogComponent, { width: '560px', panelClass: 'hz-dialog-container' });
  }
}
