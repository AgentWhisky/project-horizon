import dotenv from 'dotenv';
dotenv.config();

const { DISCORD_BOT_TOKEN, DISCORD_CLIENT_ID } = process.env;

if (!DISCORD_BOT_TOKEN || !DISCORD_CLIENT_ID) {
  throw new Error('Missing Bot Token or Client ID environment variables');
}

export const config = {
  DISCORD_BOT_TOKEN,
  DISCORD_CLIENT_ID,

  HORIZON_API_URL: process.env.HORIZON_API_URL ?? '',
  HORIZON_APP_URL: process.env.HORIZON_APP_URL ?? '',
  HORIZON_ICON_URL: process.env.HORIZON_ICON_URL ?? '',
  DEVELOPER_ICON_URL: process.env.DEVELOPER_ICON_URL ?? '',
};
