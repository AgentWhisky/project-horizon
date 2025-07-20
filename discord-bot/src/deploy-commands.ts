import { Guild, REST, Routes } from 'discord.js';
import { config } from './config';
import { commands } from './commands';
import { logError, logInfo } from './core/utils/logger.utils';

const commandsData = Object.values(commands).map((command) => command.data);

const rest = new REST({ version: '10' }).setToken(config.DISCORD_BOT_TOKEN);

export async function deployCommands(guild: Guild) {
  try {
    logInfo(`Loading slash commands into server [${guild.name}]`);
    await rest.put(Routes.applicationGuildCommands(config.DISCORD_CLIENT_ID, guild.id), {
      body: commandsData,
    });
  } catch (error) {
    logError(`Failed to load slash commands into server [${guild.name}]`, error);
  }
}
