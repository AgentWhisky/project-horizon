import { Guild, REST, Routes } from 'discord.js';
import { config } from './config';
import { commands } from './commands';
import { logInfo } from './core/utils/logger.utils';

const commandsData = Object.values(commands).map((command) => command.data);

const rest = new REST({ version: '10' }).setToken(config.DISCORD_BOT_TOKEN);

export async function deployCommands(guild: Guild) {
  try {
    logInfo(`Loading slash commannds in server [${guild.name}]`);
    await rest.put(Routes.applicationGuildCommands(config.DISCORD_CLIENT_ID, guild.id), {
      body: commandsData,
    });
  } catch (error) {
    console.error(error);
  }
}
