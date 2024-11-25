import { Component, model } from '@angular/core';

import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { SplitButtonModule } from 'primeng/splitbutton';
import { InputTextModule } from 'primeng/inputtext';
import { SidebarModule } from 'primeng/sidebar';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [ToolbarModule, ButtonModule, SplitButtonModule, InputTextModule, SidebarModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent {
  sidebarVisible = model(false);

  items: MenuItem[] | undefined;

  readonly isDarkmode = this.themeService.isDarkmode;

  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    this.items = [
      {
        label: 'Update',
        icon: 'pi pi-refresh',
      },
      {
        label: 'Delete',
        icon: 'pi pi-times',
      },
    ];
  }

  onOpenSidenav() {
    this.sidebarVisible.set(true);
  }

  onToggleTheme() {
    this.themeService.toggleTheme();
  }
}

type MenuItem = {
  label: string;
  icon: string;
};
