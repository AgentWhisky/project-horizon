import { USER_RIGHTS } from '@hz/core/constants';

export interface NavSection {
  title?: string;
  navItems: NavItem[];
}

export interface NavItem {
  name: string;
  icon?: string;
  svgIcon?: string;
  routerLink: string;
  requiredRights?: string[];
}

export const navSections: NavSection[] = [
  {
    title: 'Libraries',
    navItems: [{ routerLink: '/link-library', name: 'Link Library', icon: 'link' }],
  },
  {
    title: 'Tools',
    navItems: [
      { routerLink: '/text-analyzer', name: 'Text Analyzer', icon: 'manage_search' },
      { routerLink: '/base-converter', name: 'Base Converter', icon: 'calculate' },
      { routerLink: '/latex-editor', name: 'LaTeX Editor', icon: 'functions' },
      { routerLink: '/steam-insight', name: 'Steam Insight', svgIcon: 'steam' },
      //{ routerLink: '/pathfinder', name: 'Pathfinder', icon: 'route' },
    ],
  },
  {
    title: 'Testing',
    navItems: [{ routerLink: '/testing/dev-portal', name: 'Dev Portal', icon: 'code' }],
  },
  {
    title: 'Administration',
    navItems: [
      {
        routerLink: '/administration/dashboard',
        name: 'Admin Dashboard',
        icon: 'admin_panel_settings',
        requiredRights: [USER_RIGHTS.VIEW_DASHBOARD],
      },
      {
        routerLink: '/administration/account-management',
        name: 'Account Management',
        icon: 'manage_accounts',
        requiredRights: [USER_RIGHTS.MANAGE_USERS, USER_RIGHTS.MANAGE_ROLES],
      },
      {
        routerLink: '/administration/link-library-management',
        name: 'Link Library',
        icon: 'add_link',
        requiredRights: [USER_RIGHTS.MANAGE_LINKS],
      },
      {
        routerLink: '/administration/steam-insight-management',
        name: 'Steam Insight',
        svgIcon: 'steam',
        requiredRights: [USER_RIGHTS.MANAGE_STEAM_INSIGHT],
      },
    ],
  },
];
