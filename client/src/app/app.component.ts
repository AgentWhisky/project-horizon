import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TokenService } from './core/services/token.service';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { GITHUB_ICON, LINKEDIN_ICON } from './core/constants/icon-definitions.constant';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private tokenService = inject(TokenService);

  private matIconRegistry = inject(MatIconRegistry);
  private domSanitizer = inject(DomSanitizer);

  async ngOnInit() {
    await this.tokenService.onInitUser();
    this.registerIcons();
  }

  private registerIcons() {
    this.matIconRegistry.addSvgIconLiteral('github', this.domSanitizer.bypassSecurityTrustHtml(GITHUB_ICON));
    this.matIconRegistry.addSvgIconLiteral('linkedin', this.domSanitizer.bypassSecurityTrustHtml(LINKEDIN_ICON));
  }

  title = 'horizon';
}
