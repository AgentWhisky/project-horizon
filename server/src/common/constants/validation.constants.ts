// User
export const ACCOUNT_NAME_LENGTH = {
  MIN: 6,
  MAX: 30,
};

export const USERNAME_LENGTH = {
  MIN: 6,
  MAX: 30,
};

export const PASSWORD_LENGTH = {
  MIN: 6,
  MAX: 100,
};

// Roles
export const ROLE_NAME_LENGTH = {
  MIN: 4,
  MAX: 30,
};

export const ROLE_DESC_LENGTH = {
  MIN: 4,
  MAX: 250,
};

// *** Link Library ***
export const LINK_CONFIG = {
  NAME_MAX_LENGTH: 30,
  DESC_MAX_LENGTH: 250,
} as const;

export const LINK_CATEGORY_CONFIG = {
  NAME_MAX_LENGTH: 30,
  DESC_MAX_LENGTH: 250,
} as const;

export const LINK_TAG_CONFIG = {
  NAME_MAX_LENGTH: 30,
};
