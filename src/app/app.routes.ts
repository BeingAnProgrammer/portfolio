import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'resume',
    loadComponent: () => import('./pages/resume/resume.component').then((m) => m.ResumeComponent),
  },
  { path: '**', redirectTo: '' },
];
