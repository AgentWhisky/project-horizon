import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';

import { HzBannerModule } from '@hz/shared/components';

@Component({
  selector: 'hz-dev-portal',
  imports: [MatButtonModule, RouterModule, HzBannerModule],
  templateUrl: './dev-portal.component.html',
  styleUrl: './dev-portal.component.scss',
})
export class DevPortalComponent {}
