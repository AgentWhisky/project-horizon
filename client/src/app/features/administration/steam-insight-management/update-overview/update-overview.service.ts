import { inject, Injectable, signal } from '@angular/core';
import { catchError, of, tap } from 'rxjs';

import { LOADING_STATUS } from '@hz/core/constants';
import { TokenService } from '@hz/core/services';

import { SteamInsightUpdate } from '../resources/steam-insight-management.model';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UpdateOverviewService {
  private tokenService = inject(TokenService);

  readonly update = signal<SteamInsightUpdate | null>(null);
  readonly loadingStatus = signal<number>(LOADING_STATUS.NOT_LOADED);
  readonly loadingError = signal<number | null>(null);

  loadUpdate(id: number) {
    this.loadingStatus.set(LOADING_STATUS.IN_PROGRESS);

    this.tokenService
      .getWithTokenRefresh<SteamInsightUpdate>(`/steam-insight-management/update/${id}`)
      .pipe(
        tap((response) => {
          this.update.set(response);
          this.loadingStatus.set(LOADING_STATUS.SUCCESS);
        }),
        catchError((err: HttpErrorResponse) => {
          this.loadingStatus.set(LOADING_STATUS.FAILED);
          this.loadingError.set(err.status);
          console.error(`Failed to fetch Steam Insight update`, { id, error: err });
          return of(null);
        })
      )
      .subscribe();
  }
}
