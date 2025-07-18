import { AutocompleteInteraction, ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

import { logError } from '../../core/utils/logger.utils';
import { deleteAfter } from '../../core/utils/delete-after.util';
import { generateEmbed } from '../../core/utils/embed.util';

import { getCategories, getLinks } from './links.utils';
import { LINKS_CONFIG } from './links.constant';
import { MAX_AUTOCOMPLETE_OPTIONS } from '../../core/constants/limits.constants';

export const data = new SlashCommandBuilder()
  .setName(LINKS_CONFIG.COMMAND.NAME)
  .setDescription(LINKS_CONFIG.COMMAND.DESCRIPTION)
  .addStringOption((option) =>
    option
      .setName(LINKS_CONFIG.OPTIONS.CATEGORY.NAME)
      .setDescription(LINKS_CONFIG.OPTIONS.CATEGORY.DESCRIPTION)
      .setRequired(false)
      .setAutocomplete(true)
  )
  .addStringOption((option) =>
    option
      .setName(LINKS_CONFIG.OPTIONS.SEARCH.NAME)
      .setDescription(LINKS_CONFIG.OPTIONS.SEARCH.DESCRIPTION)
      .setRequired(false)
      .setAutocomplete(true)
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  try {
    await interaction.deferReply();

    const category = interaction.options.getString(LINKS_CONFIG.OPTIONS.CATEGORY.NAME);
    const search = interaction.options.getString(LINKS_CONFIG.OPTIONS.SEARCH.NAME);

    const links = await getLinks(category, search);
    const trimmedLinks = links.slice(0, LINKS_CONFIG.LIMITS.MAX_LINKS);
    const linkCount = trimmedLinks.length;

    // Get Link Reponse Message
    let title = '';
    if (linkCount === 0) {
      if (search && category) {
        title = LINKS_CONFIG.MESSAGES.EMPTY_BOTH.replace('[SEARCH]', search).replace('[CATEGORY]', category);
      } else if (search) {
        title = LINKS_CONFIG.MESSAGES.EMPTY_SEARCH.replace('[SEARCH]', search);
      } else if (category) {
        title = LINKS_CONFIG.MESSAGES.EMPTY_CATEGORY.replace('[CATEGORY]', category);
      } else {
        title = LINKS_CONFIG.MESSAGES.EMPTY;
      }
    } else {
      title = linkCount === 1 ? LINKS_CONFIG.MESSAGES.SINGLE : LINKS_CONFIG.MESSAGES.MULTI.replace('[LINK COUNT]', linkCount.toString());
    }

    // Build Message Embed
    const embed = generateEmbed();

    trimmedLinks.forEach((link) => {
      const hyperlink = `[${LINKS_CONFIG.HYPERLINK_MESSAGE}](<${link.url}>)`;

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
    await interaction.editReply(LINKS_CONFIG.ERRORS.FETCH_FAILURE);
  }
}

export async function autocomplete(interaction: AutocompleteInteraction) {
  const focusedOption = interaction.options.getFocused(true);
  const focusedValue = focusedOption.value.toLowerCase();

  if (focusedOption.name === LINKS_CONFIG.OPTIONS.CATEGORY.NAME) {
    try {
      const categories = await getCategories(focusedValue);
      await interaction.respond(categories.slice(0, MAX_AUTOCOMPLETE_OPTIONS).map((item) => ({ name: item.name, value: item.name })));
    } catch (error) {
      logError('Failed to fetch category autocomplete options', error);
      await interaction.respond([]);
    }
  } else if (focusedOption.name === LINKS_CONFIG.OPTIONS.SEARCH.NAME) {
    try {
      const links = await getLinks(null, focusedValue);

      await interaction.respond(links.slice(0, MAX_AUTOCOMPLETE_OPTIONS).map((item) => ({ name: item.name, value: item.name })));
    } catch (error) {
      logError('Failed to fetch search autocomplete options', error);
      await interaction.respond([]);
    }
  }
}
