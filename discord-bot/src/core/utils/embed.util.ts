import { EmbedBuilder } from 'discord.js';
import { EMBED_CONFIG } from '../constants/embed.constants';

export function generateEmbed() {
  return new EmbedBuilder()
    .setColor(EMBED_CONFIG.COLOR)
    .setTitle(EMBED_CONFIG.TITLE)
    .setAuthor({ name: EMBED_CONFIG.AUTHOR.NAME, iconURL: EMBED_CONFIG.AUTHOR.ICON_URL, url: EMBED_CONFIG.AUTHOR.URL })
    .setFooter({ text: EMBED_CONFIG.FOOTER.TEXT, iconURL: EMBED_CONFIG.FOOTER.ICON_URL })
    .setTimestamp();
}
