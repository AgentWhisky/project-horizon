import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

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
        loadComponent: () => import('./components/link-library/link-library.component').then((c) => c.LinkLibraryComponent),
      },
      {
        path: 'book-library',
        loadComponent: () => import('./components/book-library/book-library.component').then((c) => c.BookLibraryComponent),
      },
      // *** ADMINISTRATION ***
      {
        path: 'administration',
        loadComponent: () => import('./administration/admin-dashboard/admin-dashboard.component').then((c) => c.AdminDashboardComponent),
        canActivate: [authGuard],
      },
      {
        path: 'link-library-management',
        loadComponent: () => import('./administration/link-library-management/link-library-management.component').then((c) => c.LinkLibraryManagementComponent),
        canActivate: [authGuard],
      },
    ],
  },
];
