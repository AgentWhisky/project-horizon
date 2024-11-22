import { Component } from '@angular/core';

import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-left-nav',
  standalone: true,
  templateUrl: './left-nav.component.html',
  styleUrl: './left-nav.component.scss',
  imports: [RouterModule, MatIconModule, MatDividerModule],
})
export class LeftNavComponent {}
