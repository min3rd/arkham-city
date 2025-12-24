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
    path: 'roles/:id',
    loadComponent: () =>
      import('./roles/roles.component').then((m) => m.RolesComponent),
    data: {
      permissions: ['roles:write'],
    },
  },
  {
    path: 'users',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./users/users.component').then((m) => m.UsersComponent),
        data: {
          permissions: ['roles:write'],
        },
      },
      {
        path: 'new',
        loadComponent: () =>
          import('./users/users.component').then((m) => m.UsersComponent),
        data: {
          permissions: ['roles:write'],
        },
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./users/users.component').then((m) => m.UsersComponent),
        data: {
          permissions: ['roles:write'],
        },
      },
    ],
  },
  {
    path: 'projects',
    loadChildren: () =>
      import('./project/project.routes').then((r) => r.routes),
  },
];
