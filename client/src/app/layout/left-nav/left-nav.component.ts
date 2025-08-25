import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ScrollingModule } from '@angular/cdk/scrolling';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatRippleModule } from '@angular/material/core';

import { UserService } from '@hz/core/services';

import { NavSection, navSections } from './left-nav.config';

@Component({
  selector: 'hz-left-nav',
  imports: [RouterModule, MatButtonModule, MatIconModule, MatDividerModule, MatRippleModule, ScrollingModule],
  templateUrl: './left-nav.component.html',
  styleUrl: './left-nav.component.scss',
})
export class LeftNavComponent {
  private userService = inject(UserService);
  readonly isLoggedIn = this.userService.isLoggedIn;
  readonly navSections = navSections;

  showSection(section: NavSection) {
    return section.navItems.some((item) => {
      if (!item.requiredRights) {
        return true;
      }
      return this.userService.hasRights(item.requiredRights || []);
    });
  }

  hasRights(rights: string[]) {
    return this.userService.hasRights(rights);
  }
}
