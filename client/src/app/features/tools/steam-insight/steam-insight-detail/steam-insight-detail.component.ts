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

  getFormattedReleaseDate(): string {
    const rawDate = this.appDetails().releaseDate;

    if (!rawDate) {
      return '—';
    }

    // Try to parse a full date first
    const parsed = new Date(rawDate);
    if (!isNaN(parsed.getTime())) {
      const today = new Date();
      const isFuture = parsed > today;

      const formatted = parsed.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      return isFuture ? `${formatted} (Upcoming)` : formatted;
    }

    // Fallback for just year/month strings
    if (/^\d{4}$/.test(rawDate)) {
      return rawDate;
    }

    if (/^\d{4}-\d{2}$/.test(rawDate)) {
      const [year, month] = rawDate.split('-');
      const date = new Date(Number(year), Number(month) - 1);
      const formatted = date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
      });

      // Check if that month/year is in the future
      const now = new Date();
      const isFuture = date > now;

      return isFuture ? `${formatted} (Upcoming)` : formatted;
    }

    return rawDate; // fallback to whatever it is
  }
}
