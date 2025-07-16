import { CacheType, Interaction } from 'discord.js';
import { commands } from './commands';
import { logInfo } from './utils/logger.utils';

export async function handleInteractions(interaction: Interaction<CacheType>) {
  if (!interaction.isChatInputCommand()) {
    return;
  }

  logInfo(`Command [${interaction.commandName}] fired by [${interaction.user.globalName}] from ${interaction.guild?.name}`);

  const command = commands[interaction.commandName as keyof typeof commands];

  if (command) {
    command.execute(interaction);
  }
}
