// *** AUTHENTICATION ***
// Login
export const LOGIN_ERROR = {
  INVALID_CREDENTIALS: 'Invalid credentials',
  ACCOUNT_DISABLED: 'Account disabled',
};

// Registration
export const INVALID_CREATION_CODE = 'Invalid creation code';
export const USERNAME_TAKEN = 'username is already taken';

// Token refresh
export const INVALID_REFRESH_TOKEN = 'Invalid refresh token';
export const REFRESH_TOKEN_EXPIRED = 'Refresh token expired';

// Creation Code
export const CREATION_CODE_LENGTH = 12;
export const CREATION_CODE_FIELD = 'CREATION-CODE';

// USER RIGHTS
interface Right {
  id: number;
  name: string;
  internalName: string;
  description: string;
}

export const USER_RIGHTS_DEFAULT: Right[] = [
  { id: 1, name: 'View Dashboard', internalName: 'VIEW_DASHBOARD', description: 'Allows viewing the admin dashboard' },
  { id: 2, name: 'Manage Users', internalName: 'MANAGE_USERS', description: 'Allows managing user accounts' },
  { id: 3, name: 'Manage Roles', internalName: 'MANAGE_ROLES', description: 'Allows managing user roles' },
  { id: 4, name: 'Manage Links', internalName: 'MANAGE_LINKS', description: 'Allows managing library links' },
];

export const USER_RIGHTS = {
  VIEW_DASHBOARD: 'VIEW_DASHBOARD',
  MANAGE_USERS: 'MANAGE_USERS',
  MANAGE_ROLES: 'MANAGE_ROLES',
  MANAGE_LINKS: 'MANAGE_LINKS',
};
