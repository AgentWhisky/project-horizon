import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';

import { LeftNavComponent } from '../left-nav/left-nav.component';
import { NavigationService } from '../../services/navigation.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-main',
  standalone: true,
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
  imports: [
    RouterOutlet,
    RouterModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatTooltipModule,
    LeftNavComponent,
  ],
})
export class MainComponent {
  readonly isLeftNavOpen = this.navigationService.isLeftNavOpen;
  readonly isSmallScreen = this.navigationService.isSmallScreen;
  readonly isDarkmode = this.themeService.isDarkmode;

  constructor(private navigationService: NavigationService, private themeService: ThemeService) {}

  onToggleLeftNav() {
    this.navigationService.toggleLeftNav();
  }

  onCloseLeftNav() {
    this.navigationService.closeLeftNav();
  }

  onToggleTheme() {
    this.themeService.toggleTheme();
  }
}
