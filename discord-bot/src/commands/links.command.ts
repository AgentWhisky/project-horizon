import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { getLinks } from '../utils/links.utils';

export const data = new SlashCommandBuilder()
  .setName('links')
  .setDescription('Get useful links from Horizon')
  .addStringOption((option) => option.setName('category').setDescription('Filter by category').setRequired(false))
  .addStringOption((option) => option.setName('search').setDescription('Search term').setRequired(false));

export async function execute(interaction: ChatInputCommandInteraction) {
  console.log(interaction);

  try {
    await interaction.deferReply();

    const category = interaction.options.getString('category');
    const search = interaction.options.getString('search');

    const response = await getLinks(category, search);

    const sent = await interaction.editReply(response);

    if ('suppressEmbeds' in sent) {
      await sent.suppressEmbeds(true);
    }
  } catch (error) {
    console.error('Fetch error:', error);
    await interaction.editReply('There was an error fetching your links.');
  }
}
