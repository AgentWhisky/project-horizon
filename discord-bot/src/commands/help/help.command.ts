import { ChatInputCommandInteraction, MessageFlags, SlashCommandBuilder } from 'discord.js';
import { help_config } from './help.config';
import { generateEmbed } from '../../core/utils/embed.util';

export const data = new SlashCommandBuilder().setName(help_config.command.name).setDescription(help_config.command.description);

export async function execute(interaction: ChatInputCommandInteraction) {
  // Build Message Embed
  const embed = generateEmbed();

  embed.addFields(...help_config.fields);

  interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
}
