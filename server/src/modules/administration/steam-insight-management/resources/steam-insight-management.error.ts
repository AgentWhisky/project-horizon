import { STEAM_UPDATE_ERRORS, STEAM_UPDATE_MESSAGES } from './steam-insight-management.constants';

export class SteamUpdateDisabledError extends Error {
  constructor() {
    super(STEAM_UPDATE_ERRORS.updatesDisabledError);
    this.name = 'SteamUpdateDisabledError';
  }
}

export class SteamUpdateInProgressError extends Error {
  constructor() {
    super(STEAM_UPDATE_ERRORS.updateInProgressError);
    this.name = 'SteamUpdateInProgressError';
  }
}

export class SteamUpdateCanceledError extends Error {
  constructor() {
    super(STEAM_UPDATE_MESSAGES.updateCanceled);
    this.name = 'SteamUpdateCanceledError';
  }
}

export class SteamAppInfoError extends Error {
  constructor(appid: number) {
    super(`${STEAM_UPDATE_ERRORS.appInfoError} - ${appid}`);
    this.name = 'SteamAppInfoError';
  }
}

export class SteamApiKeyError extends Error {
  constructor(message?: string) {
    super(message || STEAM_UPDATE_ERRORS.apiKeyNotFoundError);
    this.name = 'SteamApiKeyError';
  }
}

export class SteamApiMaxPageError extends Error {
  constructor() {
    super(STEAM_UPDATE_ERRORS.maxPageError);
    this.name = 'SteamApiMaxPageError';
  }
}
