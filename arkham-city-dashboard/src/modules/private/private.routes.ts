import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';

export const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'roles',
    loadComponent: () =>
      import('./roles/roles.component').then((m) => m.RolesComponent),
    data: {
      permissions: ['roles:write'],
    },
  },
  {
    path: 'projects',
    loadChildren: () =>
      import('./project/project.routes').then((r) => r.routes),
  },
];
