import { Component, input } from '@angular/core';

@Component({
  selector: 'hz-steam-insight-management-app-view',
  imports: [],
  templateUrl: './steam-insight-management-app-view.component.html',
  styleUrl: './steam-insight-management-app-view.component.scss',
})
export class SteamInsightManagementAppViewComponent {
  readonly appid = input.required<number>();
}
