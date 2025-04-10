import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Routes,
} from '@angular/router';
import { TodoAppComponent } from './todo-app.component';
import { ListComponent } from './list/list.component';
import { inject } from '@angular/core';
import { TaskService } from './task.service';
import { DetailComponent } from './detail/detail.component';
import { UserService } from '../user/user.service';
import { forkJoin } from 'rxjs';

export const listResolve = () => {
  const taskService = inject(TaskService);
  return taskService.all();
};

export const detailResolve = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  const taskService = inject(TaskService);
  const userService = inject(UserService);
  return forkJoin([
    taskService.get(route.paramMap.get('id') as string),
    userService.all(),
  ]);
};

export const newResolve = () => {
  const taskService = inject(TaskService);
  const userService = inject(UserService);
  return forkJoin([taskService.reset(), userService.all()]);
};

export const routes: Routes = [
  {
    path: '',
    component: TodoAppComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        resolve: [listResolve],
        component: ListComponent,
      },
      {
        path: 'new',
        pathMatch: 'full',
        resolve: [newResolve],
        component: DetailComponent,
      },
      {
        path: ':id',
        resolve: [detailResolve],
        component: DetailComponent,
      },
    ],
  },
];
