import { inject, Injectable, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, of, tap } from 'rxjs';

import { TokenService } from '@hz/core/services';
import { HzLoadingState } from '@hz/core/utilities';

import { SteamInsightUpdateOverview } from '../../resources/steam-insight-management.model';

@Injectable({
  providedIn: 'root',
})
export class UpdateOverviewService {
  private tokenService = inject(TokenService);

  private readonly _update = signal<SteamInsightUpdateOverview | null>(null);
  readonly update = this._update.asReadonly();
  readonly loadingState = new HzLoadingState('Steam Insight Update', { adminMessage: true });

  loadUpdate(id: number) {
    if (this.loadingState.isLoading()) {
      return;
    }

    this.loadingState.setInProgress();

    this.tokenService
      .getWithTokenRefresh<SteamInsightUpdateOverview>(`/steam-insight-management/update/${id}`)
      .pipe(
        tap((update: SteamInsightUpdateOverview) => {
          this._update.set(update);
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

  reset() {
    this._update.set(null);
    this.loadingState.reset();
  }
}
