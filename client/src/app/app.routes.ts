import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./core/main/main.component').then((c) => c.MainComponent),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./components/dashboard/dashboard.component').then((c) => c.DashboardComponent),
      },
      // *** LIBRARIES ***
      {
        path: 'link-library',
        loadComponent: () => import('./components/libraries/link-library/link-library.component').then((c) => c.LinkLibraryComponent),
      },
      {
        path: 'book-library',
        loadComponent: () => import('./components/libraries/book-library/book-library.component').then((c) => c.BookLibraryComponent),
      },
      // *** TOOLS ***
      {
        path: 'base-converter',
        loadComponent: () => import('./components/tools/base-converter/base-converter.component').then((c) => c.BaseConverterComponent),
      },
      {
        path: 'pathfinder',
        loadComponent: () => import('./components/tools/pathfinder/pathfinder.component').then((c) => c.PathfinderComponent),
      },
      // *** ADMINISTRATION ***
      {
        path: 'administration',
        loadComponent: () =>
          import('./components/administration/admin-dashboard/admin-dashboard.component').then((c) => c.AdminDashboardComponent),
        canActivate: [AuthGuard],
        data: { requiredRights: ['VIEW_DASHBOARD'] },
      },
      {
        path: 'link-library-management',
        loadComponent: () =>
          import('./components/administration/link-library-management/link-library-management.component').then(
            (c) => c.LinkLibraryManagementComponent
          ),
        canActivate: [AuthGuard],
      },
      {
        path: 'account-management',
        loadComponent: () =>
          import('./components/administration/account-management/account-management.component').then((c) => c.AccountManagementComponent),
        canActivate: [AuthGuard],
        data: { requiredRights: ['MANAGE_USERS', 'MANAGE_ROLES'] },
      },
    ],
  },
];
