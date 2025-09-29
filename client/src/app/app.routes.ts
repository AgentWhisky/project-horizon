import { Routes } from '@angular/router';

import { USER_RIGHTS } from '@hz/core/constants';
import { authGuard } from './core/guards';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/main/main-layout.component').then((c) => c.MainComponent),
    children: [
      {
        path: '',
        redirectTo: 'link-library',
        pathMatch: 'full',
      },

      // *** LIBRARIES ***
      {
        path: 'link-library',
        loadComponent: () => import('./features/libraries/link-library/link-library.component').then((c) => c.LinkLibraryComponent),
      },

      // *** TOOLS ***
      {
        path: 'text-analyzer',
        loadComponent: () => import('./features/tools/text-analyzer/text-analyzer.component').then((c) => c.TextAnalyzerComponent),
      },
      {
        path: 'base-converter',
        loadComponent: () => import('./features/tools/base-converter/base-converter.component').then((c) => c.BaseConverterComponent),
      },
      {
        path: 'latex-editor',
        loadComponent: () => import('./features/tools/latex-editor/latex-editor.component').then((c) => c.LatexEditorComponent),
      },
      {
        path: 'steam-insight',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./features/tools/steam-insight/steam-insight-search/steam-insight-search.component').then(
                (c) => c.SteamInsightSearchComponent
              ),
          },
          {
            path: ':appid',
            loadComponent: () =>
              import('./features/tools/steam-insight/steam-insight-detail/steam-insight-detail.component').then(
                (c) => c.SteamInsightDetailComponent
              ),
          },
        ],
      },
      {
        path: 'pathfinder',
        loadComponent: () => import('./features/tools/pathfinder/pathfinder.component').then((c) => c.PathfinderComponent),
      },

      // *** TESTING ***
      {
        path: 'testing',
        children: [
          {
            path: 'dev-portal',
            children: [
              {
                path: '',
                loadComponent: () => import('./features/testing/dev-portal/dev-portal.component').then((c) => c.DevPortalComponent),
              },
              {
                path: 'hz-stat-card',
                loadComponent: () =>
                  import('./features/testing/test-stat-card/test-stat-card.component').then((c) => c.TestStatCardComponent),
              },
            ],
          },
        ],
      },

      // *** ADMINISTRATION ***
      {
        path: 'administration',
        canActivateChild: [authGuard],
        children: [
          {
            path: 'dashboard',
            loadComponent: () =>
              import('./features/administration/admin-dashboard/admin-dashboard.component').then((c) => c.AdminDashboardComponent),
            data: { requiredRights: [USER_RIGHTS.VIEW_DASHBOARD] },
          },
          {
            path: 'dev-portal',
            children: [
              {
                path: '',
                loadComponent: () => import('./features/testing/dev-portal/dev-portal.component').then((c) => c.DevPortalComponent),
                data: { requiredRights: [USER_RIGHTS.DEFAULT] },
              },
            ],
          },
          {
            path: 'account-management',
            loadComponent: () =>
              import('./features/administration/account-management/account-management.component').then((c) => c.AccountManagementComponent),
            data: { requiredRights: [USER_RIGHTS.MANAGE_USERS, USER_RIGHTS.MANAGE_ROLES] },
          },
          {
            path: 'link-library-management',
            loadComponent: () =>
              import('./features/administration/link-library-management/link-library-management.component').then(
                (c) => c.LinkLibraryManagementComponent
              ),
            data: { requiredRights: [USER_RIGHTS.MANAGE_LINKS] },
          },
          {
            path: 'steam-insight-management',
            loadComponent: () =>
              import('./features/administration/steam-insight-management/steam-insight-management.component').then(
                (c) => c.SteamInsightManagementComponent
              ),
            data: { requiredRights: [USER_RIGHTS.MANAGE_STEAM_INSIGHT] },
          },
          {
            path: 'steam-insight-management/:appid',
            loadComponent: () =>
              import(
                './features/administration/steam-insight-management/steam-insight-management-app-view/steam-insight-management-app-view.component'
              ).then((c) => c.SteamInsightManagementAppViewComponent),
            data: { requiredRights: [USER_RIGHTS.MANAGE_STEAM_INSIGHT] },
          },
          {
            path: '',
            redirectTo: 'dashboard',
            pathMatch: 'full',
          },
        ],
      },
    ],
  },
  // *** WILDCARD ***
  {
    path: '**',
    redirectTo: 'link-library',
  },
];
