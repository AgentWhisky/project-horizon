import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/main/main.component').then((c) => c.MainComponent),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then((c) => c.DashboardComponent),
      },
      // *** LIBRARIES ***
      {
        path: 'link-library',
        loadComponent: () => import('./features/libraries/link-library/link-library.component').then((c) => c.LinkLibraryComponent),
      },
      {
        path: 'book-library',
        loadComponent: () => import('./features/libraries/book-library/book-library.component').then((c) => c.BookLibraryComponent),
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
      // *** ADMINISTRATION ***
      {
        path: 'administration',
        loadComponent: () =>
          import('./features/administration/admin-dashboard/admin-dashboard.component').then((c) => c.AdminDashboardComponent),
        canActivate: [AuthGuard],
        data: { requiredRights: ['VIEW_DASHBOARD'] },
      },
      {
        path: 'link-library-management',
        loadComponent: () =>
          import('./features/administration/link-library-management/link-library-management.component').then(
            (c) => c.LinkLibraryManagementComponent
          ),
        canActivate: [AuthGuard],
      },
      {
        path: 'account-management',
        loadComponent: () =>
          import('./features/administration/account-management/account-management.component').then((c) => c.AccountManagementComponent),
        canActivate: [AuthGuard],
        data: { requiredRights: ['MANAGE_USERS', 'MANAGE_ROLES'] },
      },

      // *** WILDCARD ***
      {
        path: '**',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
];
