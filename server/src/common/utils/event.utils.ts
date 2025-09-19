import { HzEvent } from '../model/event.model';

/**
 * Parse a given Hz event in the format time - message
 * @param rawEvent The given event string to parse
 * @returns HzEvent format of timestamp and message
 *
 * - Input:  `"2025-09-10T15:00:33.424Z - Steam update has been started"`
 * - Output: `{ timestamp: "2025-09-10T15:00:33.424Z", message: "Steam update has been started" }`
 *
 */
export function parseHzEvent(rawEvent: string): HzEvent {
  const [timestamp, ...msg] = rawEvent.split(' - ');
  const date = new Date(timestamp);

  return {
    timestamp: date.toISOString(),
    message: msg.join(' - '), // Handle rest of message split by dashes
  };
}
