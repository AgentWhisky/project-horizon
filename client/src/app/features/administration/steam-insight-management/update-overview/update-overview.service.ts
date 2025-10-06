import { inject, Injectable, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, of, tap } from 'rxjs';

import { TokenService } from '@hz/core/services';
import { HzLoadingState } from '@hz/core/utilities';

import { SteamInsightUpdate } from '../resources/steam-insight-management.model';

@Injectable({
  providedIn: 'root',
})
export class UpdateOverviewService {
  private tokenService = inject(TokenService);

  readonly update = signal<SteamInsightUpdate | null>(null);
  readonly loadingState = new HzLoadingState('Steam Insight Update');

  loadUpdate(id: number) {
    this.loadingState.setInProgress();

    this.tokenService
      .getWithTokenRefresh<SteamInsightUpdate>(`/steam-insight-management/update/${id}`)
      .pipe(
        tap((response) => {
          this.update.set(response);
          this.loadingState.setSuccess();
        }),
        catchError((err: HttpErrorResponse) => {
          this.loadingState.setFailed(err.status);
          console.error(`Failed to fetch Steam Insight Update`, { id, error: err });
          return of(null);
        })
      )
      .subscribe();
  }
}
