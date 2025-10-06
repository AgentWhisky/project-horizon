import { computed, signal } from '@angular/core';
import { LoadingStatus } from '../enums';
import { HzErrorMessage } from '../models';
import { getGenericLoadFailureMessage, getNotFoundMessage, getServerErrorMessage, getUnauthorizedMessage } from './error-messages.util';

export interface HzLoadingOptions {
  persistSuccess?: boolean;
}

export class HzLoadingState {
  private readonly context: string;
  private readonly persistSuccess: boolean;

  private readonly _status = signal<LoadingStatus>(LoadingStatus.NOT_LOADED);
  private readonly _errorCode = signal<number | null>(null);
  private readonly _errorMessage = signal<HzErrorMessage | null>(null);

  readonly status = this._status.asReadonly();
  readonly errorCode = this._errorCode.asReadonly();
  readonly errorMessage = this._errorMessage.asReadonly();

  readonly isNotLoaded = computed(() => this._status() === LoadingStatus.NOT_LOADED);
  readonly isLoading = computed(() => this._status() === LoadingStatus.IN_PROGRESS);
  readonly isSuccess = computed(() => this._status() === LoadingStatus.SUCCESS);
  readonly isFailed = computed(() => this._status() === LoadingStatus.FAILED);

  constructor(context: string, options?: HzLoadingOptions) {
    this.context = context;
    this.persistSuccess = options?.persistSuccess ?? false;
  }

  setInProgress() {
    /** Persist success status if option enabled */
    if (this.persistSuccess && this._status() === LoadingStatus.SUCCESS) {
      return;
    }

    this._status.set(LoadingStatus.IN_PROGRESS);
    this._errorCode.set(null);
    this._errorMessage.set(null);
  }

  setSuccess() {
    this._status.set(LoadingStatus.SUCCESS);
    this._errorCode.set(null);
    this._errorMessage.set(null);
  }

  setFailed(code: number | null = null) {
    this._status.set(LoadingStatus.FAILED);
    this._errorCode.set(code);
    this._errorMessage.set(this.getErrorMessage(code));
  }

  reset() {
    this._status.set(LoadingStatus.NOT_LOADED);
    this._errorCode.set(null);
    this._errorMessage.set(null);
  }

  private getErrorMessage(code: number | null): HzErrorMessage {
    switch (code) {
      case 404:
        return getNotFoundMessage(this.context);
      case 401:
      case 403:
        return getUnauthorizedMessage(this.context);
      case 500:
        return getServerErrorMessage(this.context);
      default:
        return getGenericLoadFailureMessage(this.context);
    }
  }
}
