import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { getLinks } from '../core/utils/links.utils';
import { config } from '../config';
import { MAX_LINKS } from '../core/constants/links.constant';

export const data = new SlashCommandBuilder()
  .setName('links')
  .setDescription('Get useful links from Horizon')
  .addStringOption((option) => option.setName('category').setDescription('Filter by category').setRequired(false))
  .addStringOption((option) => option.setName('search').setDescription('Search term').setRequired(false));

export async function execute(interaction: ChatInputCommandInteraction) {
  //console.log(interaction);

  try {
    await interaction.deferReply();

    const category = interaction.options.getString('category');
    const search = interaction.options.getString('search');

    const links = await getLinks(category, search);

    //const title = links.length === 1 ? "Here's a link I found for you" : `Here are ${Math.min(links.length, MAX_LINKS)} links I found for you`; -

    let title = '';

    if (links.length === 0) {
      if (search && !category) {
        title = `No links found matching your search: "${search}"`;
      } else if (!search && category) {
        title = `No links found under the category: "${category}"`;
      } else if (!search && !category) {
        title = "I couldn't find any links to show you";
      } else {
        title = `No links found for "${search}" in category "${category}"`;
      }
    } else if (links.length === 1) {
      title = "Here's a link I found for you";
    } else {
      title = `Here are ${Math.min(links.length, MAX_LINKS)} links I found for you`;
    }

    const embed = new EmbedBuilder()
      .setColor(0x4e4fb8)
      .setTitle(title)
      .setAuthor({ name: 'HorizonBot', iconURL: config.HORIZON_ICON_URL, url: config.HORIZON_APP_URL })
      .setTimestamp()
      .setFooter({ text: 'Made by AgentWhisky', iconURL: config.DEVELOPER_ICON_URL });

    const selectedLinks = links.slice(0, MAX_LINKS);

    for (const link of selectedLinks) {
      const hyperlink = `[Navigate](<${link.url}>)`;

      embed.addFields({
        name: link.name,
        value: `${hyperlink}\n${link.description})`,
        inline: false,
      });
    }

    const sent = await interaction.editReply({ embeds: [embed] });
  } catch (error) {
    console.error('Fetch error:', error);
    await interaction.editReply('There was an error fetching your links.');
  }
}
