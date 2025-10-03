import { Component, input } from '@angular/core';
import { HzBreadcrumbItem } from '../hz-breadcrumb.model';
import { RouterModule } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'hz-breadcrumb-item',
  imports: [MatTooltipModule, MatIconModule, RouterModule],
  templateUrl: './hz-breadcrumb-item.component.html',
  styleUrl: './hz-breadcrumb-item.component.scss',
})
export class HzBreadcrumbItemComponent {
  readonly breadcrumbItem = input.required<HzBreadcrumbItem>();
  readonly last = input<boolean>(false);
}
