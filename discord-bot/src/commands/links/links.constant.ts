export const LINKS_CONFIG = {
  COMMAND: {
    NAME: 'links',
    DESCRIPTION: 'Get useful links from Horizon',
  },
  OPTIONS: {
    CATEGORY: {
      NAME: 'category',
      DESCRIPTION: 'Filter by category',
    },
    SEARCH: {
      NAME: 'search',
      DESCRIPTION: 'Search by keyword',
    },
  },
  MESSAGES: {
    EMPTY_BOTH: 'I couldn\'t find any links for "[SEARCH]" in the "[CATEGORY]" category.',
    EMPTY_SEARCH: 'Hmm, no links matched your search for "[SEARCH]".',
    EMPTY_CATEGORY: 'There are no links found for "[CATEGORY]" category.',
    EMPTY: "Looks like there aren't any links available right now.",
    SINGLE: "Here's one link I found for you.",
    MULTI: 'Here are [LINK COUNT] links I found for you.',
  },
  HYPERLINK_MESSAGE: 'Go There',
  LIMITS: {
    MAX_LINKS: 10,
  },
  ERRORS: {
    FETCH_FAILURE: 'There was an issue finding links for you.',
  },
} as const;
