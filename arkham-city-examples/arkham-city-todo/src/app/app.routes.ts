import { Routes } from '@angular/router';
import { TodoAppComponent } from '../modules/todo-app/todo-app.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'todo' },
  {
    path: 'todo',
    component: TodoAppComponent,
  },
];
