import { Component, input } from '@angular/core';

@Component({
  selector: 'hz-steam-insight-detail',
  imports: [],
  templateUrl: './steam-insight-detail.component.html',
  styleUrl: './steam-insight-detail.component.scss',
})
export class SteamInsightDetailComponent {
  readonly appid = input.required<number>();
}
