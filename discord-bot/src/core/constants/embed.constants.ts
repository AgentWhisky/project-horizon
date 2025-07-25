import { config } from '../../config';

export const EMBED_CONFIG = {
  COLOR: 0x4e4fb8,
  AUTHOR: {
    NAME: 'HorizonBot',
    ICON_URL: config.HORIZON_ICON_URL,
    URL: config.HORIZON_APP_URL,
  },
  FOOTER: {
    TEXT: 'Made by AgentWhisky',
    ICON_URL: config.DEVELOPER_ICON_URL,
  },
} as const;

export const EMBED_EMPTY_FIELD = { name: '\u200B', value: '\u200B' } as const;
