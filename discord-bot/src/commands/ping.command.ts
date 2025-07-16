import { CommandInteraction, SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder().setName('ping').setDescription('Replies with Pong!');

export async function execute(interaction: CommandInteraction) {
  const randNum = Math.random();

  return interaction.reply(`Pong! ${randNum} - Hello ${interaction.user.globalName}!`);
}
