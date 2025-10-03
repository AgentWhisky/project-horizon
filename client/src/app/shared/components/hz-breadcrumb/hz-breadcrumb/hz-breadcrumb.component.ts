import { Component, effect, inject, input, signal } from '@angular/core';
import { HzBreadcrumbItem } from '../hz-breadcrumb.model';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ScreenService } from '@hz/core/services';
import { HzBreadcrumbItemComponent } from '../hz-breadcrumb-item/hz-breadcrumb-item.component';

@Component({
  selector: 'hz-breadcrumb',
  imports: [MatIconModule, MatTooltipModule, RouterModule, HzBreadcrumbItemComponent],
  templateUrl: './hz-breadcrumb.component.html',
  styleUrl: './hz-breadcrumb.component.scss',
})
export class HzBreadcrumbComponent {
  private screenService = inject(ScreenService);

  readonly items = input.required<HzBreadcrumbItem[]>();

  readonly isMobileScreen = this.screenService.isMobileScreen;
  readonly isExpanded = signal<boolean>(false);

  constructor() {
    // Reset is expanded when screen size leaves mobile size
    effect(() => {
      if (!this.isMobileScreen()) {
        this.isExpanded.set(false);
      }
    });
  }

  onExpand() {
    this.isExpanded.set(true);
  }
}
