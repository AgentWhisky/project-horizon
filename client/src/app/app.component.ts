import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TokenService } from './core/services/token.service';
import { IconService } from './core/services/icon.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private tokenService = inject(TokenService);
  private iconService = inject(IconService);

  constructor() {
    this.iconService.registerIcons();
  }

  async ngOnInit() {
    await this.tokenService.onInitUser();
  }
}
