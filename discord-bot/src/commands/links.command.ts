import { AutocompleteInteraction, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { getLinks } from '../core/utils/links.utils';
import { config } from '../config';
import { MAX_LINKS } from '../core/constants/links.constant';
import { deleteAfter } from '../core/utils/delete-after.util';
import { EMBED_COLOR } from '../core/constants/embed.constants';

export const data = new SlashCommandBuilder()
  .setName('links')
  .setDescription('Get useful links from Horizon')
  .addStringOption((option) => option.setName('category').setDescription('Filter by category').setRequired(false).setAutocomplete(true))
  .addStringOption((option) => option.setName('search').setDescription('Search term').setRequired(false).setAutocomplete(true));

export async function execute(interaction: ChatInputCommandInteraction) {
  try {
    await interaction.deferReply();

    const category = interaction.options.getString('category');
    const search = interaction.options.getString('search');

    const links = await getLinks(category, search);

    let title = '';

    if (links.length === 0) {
      if (search && category) {
        title = `No links found for "${search}" in category "${category}"`;
      } else if (search) {
        title = `No links found matching your search: "${search}"`;
      } else if (category) {
        title = `No links found under the category: "${category}"`;
      } else {
        title = 'No links found';
      }
    } else {
      const base =
        links.length === 1 ? "Here's a link I found for you" : `Here are __${Math.min(links.length, MAX_LINKS)}__ links I found for you`;

      const contextParts = [];
      if (search) contextParts.push(`your search "${search}"`);
      if (category) contextParts.push(`category "${category}"`);

      title = contextParts.length ? `${base} for ${contextParts.join(' in ')}` : base;
    }

    const embed = new EmbedBuilder()
      .setColor(EMBED_COLOR)
      .setTitle(`${title}`)
      .setAuthor({ name: 'HorizonBot', iconURL: config.HORIZON_ICON_URL, url: config.HORIZON_APP_URL })
      .setTimestamp()
      .setFooter({ text: 'Made by AgentWhisky', iconURL: config.DEVELOPER_ICON_URL });

    const selectedLinks = links.slice(0, MAX_LINKS);

    for (const link of selectedLinks) {
      const hyperlink = `[Go to ${link.name}](<${link.url}>)`;

      embed.addFields({
        name: link.name,
        value: `${hyperlink}\n${link.description}`,
        inline: false,
      });
    }

    const reply = await interaction.editReply({ embeds: [embed] });

    deleteAfter(reply);
  } catch (error) {
    console.error('Fetch error:', error);
    await interaction.editReply('There was an error fetching your links.');
  }
}

export async function autocomplete(interaction: AutocompleteInteraction) {
  
}
