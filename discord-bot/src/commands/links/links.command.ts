import { AutocompleteInteraction, ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

import { logError } from '../../core/utils/logger.utils';
import { deleteAfter } from '../../core/utils/delete-after.util';
import { generateEmbed } from '../../core/utils/embed.util';

import { getCategories, getLinks } from './links.utils';
import { MAX_AUTOCOMPLETE_OPTIONS } from '../../core/constants/limits.constants';
import { links_config } from './links.config';

export const data = new SlashCommandBuilder()
  .setName(links_config.command.name)
  .setDescription(links_config.command.description)
  .addStringOption((option) =>
    option
      .setName(links_config.options.category.name)
      .setDescription(links_config.options.category.description)
      .setRequired(false)
      .setAutocomplete(true)
  )
  .addStringOption((option) =>
    option
      .setName(links_config.options.search.name)
      .setDescription(links_config.options.search.description)
      .setRequired(false)
      .setAutocomplete(true)
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  try {
    await interaction.deferReply();

    const category = interaction.options.getString(links_config.options.category.name);
    const search = interaction.options.getString(links_config.options.search.name);

    const links = await getLinks(category, search);
    const trimmedLinks = links.slice(0, links_config.constraints.maxLinks);
    const linkCount = trimmedLinks.length;

    // Get Link Reponse Message
    let title = '';
    if (linkCount === 0) {
      if (search && category) {
        title = links_config.text.emptyBoth.replace('[SEARCH]', search).replace('[CATEGORY]', category);
      } else if (search) {
        title = links_config.text.emptySearch.replace('[SEARCH]', search);
      } else if (category) {
        title = links_config.text.emptyCategory.replace('[CATEGORY]', category);
      } else {
        title = links_config.text.empty;
      }
    } else {
      title = linkCount === 1 ? links_config.text.single : links_config.text.multi.replace('[LINK COUNT]', linkCount.toString());
    }

    // Build Message Embed
    const embed = generateEmbed();

    embed.setTitle(title);

    trimmedLinks.forEach((link) => {
      const hyperlink = `[${links_config.hyperlinkText.link}](<${link.url}>)`;

      embed.addFields({
        name: link.name,
        value: `${hyperlink}\n${link.description}`,
        inline: false,
      });
    });

    const message = await interaction.editReply({ embeds: [embed] });

    deleteAfter(message);
  } catch (error) {
    logError('Failed to fetch links', error);
    await interaction.editReply(links_config.errors.fetchFailure);
  }
}

export async function autocomplete(interaction: AutocompleteInteraction) {
  const focusedOption = interaction.options.getFocused(true);
  const focusedValue = focusedOption.value.toLowerCase();

  if (focusedOption.name === links_config.options.category.name) {
    try {
      const categories = await getCategories(focusedValue);
      await interaction.respond(categories.slice(0, MAX_AUTOCOMPLETE_OPTIONS).map((item) => ({ name: item.name, value: item.name })));
    } catch (error) {
      logError('Failed to fetch category autocomplete options', error);
      await interaction.respond([]);
    }
  } else if (focusedOption.name === links_config.options.search.name) {
    try {
      const links = await getLinks(null, focusedValue);

      await interaction.respond(links.slice(0, MAX_AUTOCOMPLETE_OPTIONS).map((item) => ({ name: item.name, value: item.name })));
    } catch (error) {
      logError('Failed to fetch search autocomplete options', error);
      await interaction.respond([]);
    }
  }
}
