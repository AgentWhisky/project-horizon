import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TokenService } from './services/token.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private tokenService = inject(TokenService);

  ngOnInit() {
    this.tokenService.onInitUser();
  }

  title = 'horizon';
}
