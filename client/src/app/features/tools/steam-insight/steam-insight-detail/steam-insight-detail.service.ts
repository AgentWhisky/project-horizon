import { inject, Injectable, signal } from '@angular/core';
import { TokenService } from '../../../../core/services/token.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { emptySteamAppDetails, SteamAppDetails } from './steam-insight-detail';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SteamInsightDetailService {
  private tokenService = inject(TokenService);
  private snackbar = inject(MatSnackBar);

  private _appDetails = signal<SteamAppDetails>(emptySteamAppDetails);
  readonly appDetails = this._appDetails.asReadonly();

  constructor() {}

  async loadSteamAppDetails(appid: number) {
    try {
      const appDetails = await this.getSteamAppDetails(appid);
      this._appDetails.set(appDetails);
    } catch (error) {
      console.error(`Error Fetching Steam App Details: ${error}`);
      this.snackbar.open('Failed to load Steam App details.', 'Close', { duration: 3000 });
    }
  }

  private async getSteamAppDetails(appid: number) {
    const appDetails$ = this.tokenService.getWithTokenRefresh<SteamAppDetails>(`/steam-insight/${appid}`);
    return firstValueFrom(appDetails$);
  }
}
