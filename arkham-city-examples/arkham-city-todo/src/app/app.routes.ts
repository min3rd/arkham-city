import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'todo' },
  {
    path: 'todo',
    loadChildren: () =>
      import('../modules/todo-app/todo-app.routes').then((r) => r.routes),
  },
  {
    path: 'users',
    loadChildren: () =>
      import('../modules/user/user.routes').then((r) => r.routes),
  },
];
