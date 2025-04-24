export const SMALL_SCREEN_SIZE = 1100;

export const ACCESS_TOKEN = 'accessToken';
export const REFRESH_TOKEN = 'refreshToken';

export const USER_RIGHTS = {
  VIEW_DASHBOARD: 'VIEW_DASHBOARD',
  MANAGE_USERS: 'MANAGE_USERS',
  MANAGE_ROLES: 'MANAGE_ROLES',
  MANAGE_LINKS: 'MANAGE_LINKS',
  IMPORT_LINK_LIBRARY: 'IMPORT_LINK_LIBRARY',
};

// Regular Expressions
export const URL_REGEX = /^[A-Za-z][A-Za-z\d.+-]*:\/*(?:\w+(?::\w+)?@)?[^\s/]+(?::\d+)?(?:\/[\w#!:.?+=&%@\-/]*)?$/;

// Default Conversion Bases
export const defaultNumericBases: number[] = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 16, 20, 26, 32, 36];
