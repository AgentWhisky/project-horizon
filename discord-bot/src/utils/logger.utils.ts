import { format } from 'date-fns';

const LOG_COLORS = {
  DEFAULT: '\x1b[0m',
  INFO: '\x1b[32m',
  WARN: '\x1b[33m',
  ERROR: '\x1b[31m',
};

export function logInfo(message: string) {
  console.log(`${LOG_COLORS.INFO}[INFO] - [${getTimestamp()}] ${message}${LOG_COLORS.DEFAULT}`);
}

export function logWarn(message: string) {
  console.warn(`${LOG_COLORS.WARN}[WARN] - [${getTimestamp()}] ${message}${LOG_COLORS.DEFAULT}`);
}

export function logError(message: string, error?: unknown) {
  console.log(`${LOG_COLORS.ERROR}[ERROR] - [${getTimestamp()}] ${message}${LOG_COLORS.DEFAULT}`);

  if (error) {
    console.error(error);
  }
}

function getTimestamp(): string {
  return format(new Date(), 'yyyy-MM-dd hh:mm:ss');
}
