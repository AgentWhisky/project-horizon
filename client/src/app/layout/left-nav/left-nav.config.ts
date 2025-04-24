import { USER_RIGHTS } from '../../core/constants/user-rights.constant';

export interface NavSection {
  title?: string;
  navItems: NavItem[];
}

export interface NavItem {
  name: string;
  icon: string;
  routerLink: string;
  requiredRights?: string[];
}

export const navSections: NavSection[] = [
  {
    title: '',
    navItems: [{ routerLink: '/dashboard', name: 'Dashboard', icon: 'home' }],
  },
  {
    title: 'Libraries',
    navItems: [{ routerLink: '/link-library', name: 'Link Library', icon: 'link' }],
  },
  {
    title: 'Tools',
    navItems: [
      { routerLink: '/text-analyzer', name: 'Text Analyzer', icon: 'manage_search' },
      { routerLink: '/base-converter', name: 'Base Converter', icon: 'calculate' },
      { routerLink: '/pathfinder', name: 'Pathfinder', icon: 'route' },
    ],
  },
  {
    title: 'Administration',
    navItems: [
      {
        routerLink: '/administration',
        name: 'Admin Dashboard',
        icon: 'admin_panel_settings',
        requiredRights: [USER_RIGHTS.VIEW_DASHBOARD],
      },
      {
        routerLink: '/account-management',
        name: 'Account Management',
        icon: 'manage_accounts',
        requiredRights: [USER_RIGHTS.MANAGE_USERS, USER_RIGHTS.MANAGE_ROLES],
      },
      { routerLink: '/link-library-management', name: 'Link Library', icon: 'add_link', requiredRights: [USER_RIGHTS.MANAGE_LINKS] },
    ],
  },
];
