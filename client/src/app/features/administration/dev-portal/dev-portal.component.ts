import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'hz-dev-portal',
  imports: [MatButtonModule, RouterModule],
  templateUrl: './dev-portal.component.html',
  styleUrl: './dev-portal.component.scss',
})
export class DevPortalComponent {}
