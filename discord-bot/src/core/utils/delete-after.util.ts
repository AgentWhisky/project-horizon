import { Message } from 'discord.js';
import { DEFAULT_DELETE_TIME_MS } from '../constants/delete-after.constants';

/**
 * Delete a message after a specified delay in milliseconds
 * @param message The given discord message to delete
 * @param delayMs The delay in milliseconds until the message is deleted
 */
export function deleteAfter(message: Message, delayMs = DEFAULT_DELETE_TIME_MS) {
  setTimeout(() => {
    message.delete().catch((err) => {
      if (err.code !== 10008) {
        console.error(`Failed to delete message:`, err);
      }
    });
  }, delayMs);
}
