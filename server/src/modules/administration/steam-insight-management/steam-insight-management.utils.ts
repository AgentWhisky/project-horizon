import { ChangeDiff, SteamAppInfo } from './steam-insight-management.model';

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

function deepEqual(a: any, b: any): boolean {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (a && b && typeof a === 'object') {
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    if (aKeys.length !== bKeys.length) return false;
    return aKeys.every((k) => deepEqual(a[k], b[k]));
  }
  return false;
}

export function generateDiff<T extends object>(before: T | null, after: T): ChangeDiff {
  const diff: ChangeDiff = {};

  // Handle INSERT actions with no existing data
  if (!before) {
    for (const key of Object.keys(after)) {
      diff[key] = { before: null, after: (after as any)[key] };
    }
    return diff;
  }

  for (const key of Object.keys(after)) {
    const beforeVal = (before as any)[key];
    const afterVal = (after as any)[key];

    // Skip unchanged fields
    if (!deepEqual(beforeVal, afterVal)) {
      diff[key] = { before: beforeVal, after: afterVal };
    }
  }

  return diff;
}
