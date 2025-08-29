export class SteamUpdateDisabledError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SteamUpdateDisabledError';
  }
}

export class SteamUpdateInProgressError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SteamUpdateInProgressError';
  }
}

export class SteamAppInfoError extends Error {
  constructor(message: string, appid: number) {
    super(message);
    this.name = 'SteamAppInfoError';
  }
}

export class SteamApiKeyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SteamApiKeyError';
  }
}

export class SteamApiMaxPageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SteamApiMaxPageError';
  }
}
