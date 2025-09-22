import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ScrollingModule } from '@angular/cdk/scrolling';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';

import { APP_URLS, ASSET_URLS } from '@hz/core/constants';
import { NavigationService, ScreenService, ThemeService, UserService, VersionHistoryService } from '@hz/core/services';

import { environment } from '../../../environments/environment';
import { LeftNavComponent } from '../left-nav/left-nav.component';
import { AppVersionDialogComponent } from '../app-version-dialog/app-version-dialog.component';
import { CommonModule } from '@angular/common';

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
    CommonModule,
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

  readonly isLeftNavOpen = this.navigationService.isLeftNavOpen;
  readonly isLoggedIn = this.userService.isLoggedIn;
  readonly isDarkmode = this.themeService.isDarkTheme;

  readonly currentVersionInfo = this.versionHistoryService.currentVersionInfo;
  readonly envName = environment.envName;

  readonly githubUrl = APP_URLS.DEVELPOER_GITHUB;
  readonly githubRepoUrl = APP_URLS.APP_GITHUB_REPOSITORY;
  readonly linkedInUrl = APP_URLS.LINKEDIN;

  readonly appIcon = ASSET_URLS.DEFAULT_ICON;

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
