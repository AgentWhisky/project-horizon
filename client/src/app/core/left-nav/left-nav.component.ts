import { Component, inject } from '@angular/core';

import { RouterModule } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { UserService } from '../../services/user.service';
import { NavSection, navSections } from './left-nav';

@Component({
  selector: 'app-left-nav',
  imports: [RouterModule, MatButtonModule, MatIconModule, MatDividerModule],
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
      return this.hasRights(item.requiredRights || []);
    });
  }

  hasRights(rights: string[]) {
    return this.userService.hasRights(rights);
  }
}
