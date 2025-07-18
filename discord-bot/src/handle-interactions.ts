import { CacheType, Interaction } from 'discord.js';
import { commands } from './commands';
import { logInfo } from './core/utils/logger.utils';

export async function handleInteractions(interaction: Interaction<CacheType>) {
  // Handle Slash Command
  if (interaction.isChatInputCommand()) {
    logInfo(`Command [${interaction.commandName}] fired by [${interaction.user.globalName}] from ${interaction.guild?.name}`);

    const command = commands[interaction.commandName as keyof typeof commands];

    if (command && typeof command.execute === 'function') {
      return command.execute(interaction);
    }
  }

  // Handle Autocomplete
  if (interaction.isAutocomplete()) {
    logInfo(`Autocomplete [${interaction.commandName}] fired by [${interaction.user.globalName}] from ${interaction.guild?.name}`);

    const command = commands[interaction.commandName as keyof typeof commands];
    if (command && typeof command.autocomplete === 'function') {
      return command.autocomplete(interaction);
    }
    return;
  }
}
