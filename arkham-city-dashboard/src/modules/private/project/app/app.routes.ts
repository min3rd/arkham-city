import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { DetailComponent } from './detail/detail.component';
import {
  appDetailResolver,
  appListResolver,
  canDeactiveDetail,
  newAppResolver,
} from './app.resolver';
import { ListComponent } from './list/list.component';

export const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    resolve: [appListResolver],
    children: [
      {
        path: '',
        component: ListComponent,
        children: [
          {
            path: 'new-app',
            pathMatch: 'full',
            resolve: [newAppResolver],
            canDeactivate: [canDeactiveDetail],
            component: DetailComponent,
          },
          {
            path: ':appId',
            resolve: [appDetailResolver],
            canDeactivate: [canDeactiveDetail],
            component: DetailComponent,
          },
        ],
      },
    ],
  },
];
