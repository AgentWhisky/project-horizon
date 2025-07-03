import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { TokenService } from './core/services/token.service';
import { IconService } from './core/services/icon.service';
import { TitleService } from './core/services/title.service';

@Component({
  selector: 'hz-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private titleService = inject(TitleService);
  private tokenService = inject(TokenService);
  private iconService = inject(IconService);

  constructor() {
    this.iconService.registerIcons();
  }

  async ngOnInit() {
    this.titleService.resetTitle();
    await this.tokenService.onInitUser();
  }
}
