export const MINOR_LENGTH = 6 as const;
export const MINOR_STEP = 46656;
export const MINOR_MIN = '000000' as const;
export const MINOR_BASE = '100000' as const;
export const MINOR_MAX = 'ZZZZZZ' as const;
export const MINOR_MAX_NUM = parseInt(MINOR_MAX, 36);

export const REBASE_REQUIRED = 'REBASE_REQUIRED' as const;
