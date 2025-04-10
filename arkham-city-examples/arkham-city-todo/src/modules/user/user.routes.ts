import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Routes,
} from '@angular/router';
import { UserComponent } from './user.component';
import { DetailComponent } from './detail/detail.component';
import { ListComponent } from './list/list.component';
import { inject } from '@angular/core';
import { UserService } from './user.service';

export const listResolve = () => {
  const userService = inject(UserService);
  return userService.all();
};

export const detailResolve = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  const userService = inject(UserService);
  return userService.get(route.paramMap.get('id') as string);
};

export const routes: Routes = [
  {
    path: '',
    component: UserComponent,
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
