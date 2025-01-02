import { Routes } from '@angular/router';

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
      {
        path: 'link-library',
        loadComponent: () => import('./components/link-library/link-library.component').then((c) => c.LinkLibraryComponent),
      },
      {
        path: 'book-library',
        loadComponent: () => import('./components/book-library/book-library.component').then((c) => c.BookLibraryComponent),
      },
    ],
  },
];
