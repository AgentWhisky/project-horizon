export const links_config = {
  command: {
    name: 'links',
    description: 'Get useful links from Horizon',
  },
  options: {
    category: {
      name: 'category',
      description: 'Filter by category',
    },
    search: {
      name: 'search',
      description: 'Search by keyword',
    },
  },
  fields: {},
  text: {
    emptyBoth: 'I couldn\'t find any links for "[SEARCH]" in the "[CATEGORY]" category.',
    emptySearch: 'Hmm, no links matched your search for "[SEARCH]".',
    emptyCategory: 'There are no links found for "[CATEGORY]" category.',
    empty: "Looks like there aren't any links available right now.",
    single: "Here's one link I found for you.",
    multi: 'Here are [LINK COUNT] links I found for you.',
  },
  hyperlinkText: {
    link: 'Go There',
  },
  constraints: {
    maxLinks: 10,
  },
  errors: {
    fetchFailure: 'There was an issue finding links for you.',
  },
} as const;
