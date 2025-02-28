interface Right {
  id: number;
  name: string;
  internalName: string;
  description: string;
}

export const USER_RIGHTS: Right[] = [
  { id: 1, name: 'View Dashboard', internalName: 'VIEW_DASHBOARD', description: 'Allows viewing the admin dashboard' },
  { id: 2, name: 'View Users', internalName: 'VIEW_USERS', description: '' },
  { id: 3, name: 'Manage Roles', internalName: '', description: '' },
  { id: 4, name: '', internalName: '', description: '' },
  { id: 5, name: '', internalName: '', description: '' },
  { id: 6, name: '', internalName: '', description: '' },
];

// View Dashboard
// Manage Users
// Manage Roles
// Manage Links