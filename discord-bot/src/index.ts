import { Client, Events, GatewayIntentBits } from 'discord.js';

import { config } from './config';
import { deployCommands } from './deploy-commands';
import { handleInteractions } from './handle-interactions';
import { logInfo } from './core/utils/logger.utils';

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.DirectMessages],
});

// ON CLIENT READY
client.once(Events.ClientReady, () => {
  logInfo('HorizonBot is online and ready.');
  logInfo(`Logged in as ${client.user?.tag}`);
  logInfo(`Using Horizon API: ${config.HORIZON_API_URL}\n`);
  logInfo(`Connected to ${client.guilds.cache.size} server(s):`);

  client.guilds.cache.forEach(async (guild) => {
    logInfo(`- ${guild.name} (ID: ${guild.id})`);
    await deployCommands(guild);
  });
  console.log('\n');
});

// ON SERVER CONNECTION
client.on(Events.GuildCreate, async (guild) => {
  await deployCommands(guild);
});

// ON INTERACTION
client.on(Events.InteractionCreate, async (interaction) => {
  await handleInteractions(interaction);
});

// LOGIN
client.login(config.DISCORD_BOT_TOKEN);
