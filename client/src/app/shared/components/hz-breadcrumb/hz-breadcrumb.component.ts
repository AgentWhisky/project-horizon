import { Component, input } from '@angular/core';
import { HzBreadcrumbItem } from './hz-breadcrumb.model';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'hz-breadcrumb',
  imports: [MatIconModule, MatTooltipModule, RouterModule],
  templateUrl: './hz-breadcrumb.component.html',
  styleUrl: './hz-breadcrumb.component.scss',
})
export class HzBreadcrumbComponent {
  readonly items = input.required<HzBreadcrumbItem[]>();
}
