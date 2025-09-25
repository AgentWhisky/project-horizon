import { SteamAppInfo } from './resources/steam-insight-management.model';

export function generateEventAppend(message: string): () => string {
  return () => `array_append(events, '${generateEventMessage(message)}')`;
}

export function generateEventMessage(message: string): string {
  return `${new Date().toISOString()} - ${message}`;
}

export function isAdultGame(appInfo: SteamAppInfo): boolean {
  const name = appInfo.name?.toLowerCase() ?? '';

  const about = appInfo.about_the_game?.toLowerCase() ?? '';
  const desc = appInfo.detailed_description?.toLowerCase() ?? '';
  const notes = appInfo.content_descriptors?.notes?.toLowerCase() ?? '';
  const germanyBan = appInfo.ratings?.steam_germany?.banned === '1';
  const descriptorIds = appInfo.content_descriptors?.ids ?? [];

  return (
    germanyBan ||
    /\b(hentai|sex\s?game|sex\s?simulator|nsfw|eroge|porn|lewd|uncensored)\b/.test(name) ||
    [/uncensored adult game/, /explicit sexual content/, /sexually explicit/, /intended for adults only/, /pornographic/].some(
      (regex) => regex.test(about) || regex.test(desc)
    ) ||
    /\b(hentai|pornographic|explicit sexual|adult only|uncensored)\b/.test(notes) ||
    descriptorIds.includes(4)
  );
}
