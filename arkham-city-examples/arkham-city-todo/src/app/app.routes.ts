import { Routes } from '@angular/router';
import { TodoAppComponent } from '../modules/todo-app/todo-app.component';
import { UserComponent } from '../modules/user/user.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'todo' },
  {
    path: 'todo',
    component: TodoAppComponent,
  },
  {
    path: 'users',
    loadChildren: () =>
      import('../modules/user/user.routes').then((r) => r.routes),
  },
];
