import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./core/main/main.component').then((c) => c.MainComponent),
  },
];
