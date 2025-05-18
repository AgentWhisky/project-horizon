import { Component, inject, input, OnInit } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { CommonModule, DecimalPipe, TitleCasePipe } from '@angular/common';

import { SteamInsightDetailService } from './steam-insight-detail.service';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { DecodeHtmlPipe } from '../../../../core/pipes/decode-html.pipe';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'hz-steam-insight-detail',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatTabsModule,
    MatChipsModule,
    MatCardModule,
    MatExpansionModule,
    RouterModule,
    CommonModule,
    DecimalPipe,
    TitleCasePipe,
    DecodeHtmlPipe,
  ],
  templateUrl: './steam-insight-detail.component.html',
  styleUrl: './steam-insight-detail.component.scss',
})
export class SteamInsightDetailComponent implements OnInit {
  readonly appid = input.required<number>();

  readonly steamInsightDetailService = inject(SteamInsightDetailService);

  readonly appDetails = this.steamInsightDetailService.appDetails;

  ngOnInit() {
    this.steamInsightDetailService.loadSteamAppDetails(this.appid());
  }
}
