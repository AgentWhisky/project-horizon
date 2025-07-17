import { Message } from 'discord.js';
import { DEFAULT_DELETE_TIME_MS } from '../constants/deleteAfter.constants';

export function deleteAfter(message: Message, delayMs = DEFAULT_DELETE_TIME_MS) {
  setTimeout(() => {
    message.delete().catch((err) => {
      if (err.code !== 10008) {
        console.error(`Failed to delete message:`, err);
      }
    });
  }, delayMs);
}
