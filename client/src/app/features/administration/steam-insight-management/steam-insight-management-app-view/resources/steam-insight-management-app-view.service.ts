import { inject, Injectable, signal } from '@angular/core';
import { SteamInsightAppRaw } from './steam-insight-management-app-view.model';
import { TokenService } from '@hz/core/services';
import { firstValueFrom } from 'rxjs';
import { LOADING_STATUS } from '@hz/core/constants';

@Injectable({
  providedIn: 'root',
})
export class SteamInsightManagementAppViewService {
  private tokenService = inject(TokenService);

  readonly appRaw = signal<SteamInsightAppRaw | null>(null);
  readonly appRawLoadingStatus = signal<number>(LOADING_STATUS.NOT_LOADED);

  async loadAppRaw(appid: number) {
    try {
      this.appRawLoadingStatus.set(LOADING_STATUS.IN_PROGRESS);
      
      const raw = await this.getAppRaw(appid);
      this.appRaw.set(raw);

      this.appRawLoadingStatus.set(LOADING_STATUS.SUCCESS);
    } catch (error) {
      this.appRawLoadingStatus.set(LOADING_STATUS.FAILED);
      console.error(`Error fetching app raw data: ${error}`);
    }
  }

  private async getAppRaw(appid: number) {
    const app$ = this.tokenService.getWithTokenRefresh<SteamInsightAppRaw>(`/steam-insight-management/app/${appid}`);
    return firstValueFrom(app$);
  }
}
