import { inject, Injectable, signal } from '@angular/core';
import { TokenService } from '../../../core/services/token.service';
import { SteamAppSummary } from './steam-insight';

@Injectable({
  providedIn: 'root',
})
export class SteamInsightService {
  private tokenService = inject(TokenService);

  private _steamApps = signal<SteamAppSummary[]>([]);
  readonly steamApps = this._steamApps.asReadonly();

  constructor() {}

  async loadSteamApps(search: string, allowAdultContent = false, pageNumber: number = 1, pageSize: number = 20) {}
}
