import { config } from '../../config';
import { EMBED_EMPTY_FIELD } from '../../core/constants/embed.constants';

export const help_config = {
  command: {
    name: 'help',
    description: 'List all available commands',
  },
  fields: [
    {
      name: 'About Horizon',
      value: `[Horizon](${config.HORIZON_APP_URL}) is a web application that brings together a variety of useful tools and resources in one place. It includes features like a curated link library (also accessible via this bot), number base converters, text analysis tools, a LaTeX editor, and a Steam game search viewer.`,
    },
    EMBED_EMPTY_FIELD,
    {
      name: '/links',
      value:
        'Search and browse useful links from the Horizon database.\n\n`category` — Filter results by a specific category\n`search` — Match links that contain **all** provided keywords (space-separated)',
    },
  ],
} as const;
