import { inject, Injectable, signal } from '@angular/core';
import { catchError, of, tap } from 'rxjs';

import { LOADING_STATUS } from '@hz/core/constants';
import { TokenService } from '@hz/core/services';

import { SteamInsightUpdate } from '../resources/steam-insight-management.model';

@Injectable({
  providedIn: 'root',
})
export class UpdateOverviewService {
  private tokenService = inject(TokenService);

  readonly update = signal<SteamInsightUpdate | null>(null);
  readonly updateLoadingStatus = signal<number>(LOADING_STATUS.NOT_LOADED);

  loadUpdate(id: number) {
    this.updateLoadingStatus.set(LOADING_STATUS.IN_PROGRESS);

    this.tokenService
      .getWithTokenRefresh<SteamInsightUpdate>(`/steam-insight-management/update/${id}`)
      .pipe(
        tap((response) => {
          this.update.set(response);
          this.updateLoadingStatus.set(LOADING_STATUS.SUCCESS);
        }),
        catchError((err) => {
          this.updateLoadingStatus.set(LOADING_STATUS.FAILED);
          console.error(`Failed to fetch Steam Insight update`, { id, error: err });
          return of(null);
        })
      )
      .subscribe();
  }
}
