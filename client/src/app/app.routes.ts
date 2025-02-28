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
      // *** TOOLS ***
      {
        path: 'link-library',
        loadComponent: () => import('./components/libraries/link-library/link-library.component').then((c) => c.LinkLibraryComponent),
      },
      {
        path: 'book-library',
        loadComponent: () => import('./components/libraries/book-library/book-library.component').then((c) => c.BookLibraryComponent),
      },

      // *** DEV ***
      {
        path: 'dev-buttons',
        loadComponent: () => import('./components/dev/button-triggers/button-triggers.component').then((c) => c.ButtonTriggersComponent),
      },
      // *** ADMINISTRATION ***
      {
        path: 'administration',
        loadComponent: () =>
          import('./components/administration/admin-dashboard/admin-dashboard.component').then((c) => c.AdminDashboardComponent),
        canActivate: [AuthGuard],
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
          import('./components/administration/account-management/account-management.component').then(
            (c) => c.AccountManagementComponent
          ),
        canActivate: [AuthGuard],
      },
    ],
  },
];
