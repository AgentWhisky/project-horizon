import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then((c) => c.LoginComponent),
  },
  {
    path: '',
    loadComponent: () => import('./core/main/main.component').then((c) => c.MainComponent),
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        loadComponent: () => import('./components/home/home.component').then((c) => c.HomeComponent),
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
