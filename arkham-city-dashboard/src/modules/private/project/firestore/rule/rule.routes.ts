import { ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { RuleComponent } from './rule.component';
import { ListComponent } from './list/list.component';
import { inject } from '@angular/core';
import { RuleService } from './rule.service';
import { RouteUtils } from '../../../../../core/utils/route.utils';
import { DetailComponent } from './detail/detail.component';

export const listResolve = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const ruleService = inject(RuleService);
  const projectId = RouteUtils.getParam('projectId', route);
  return ruleService.all(projectId);
};

export const routes: Routes = [
  {
    path: '',
    component: RuleComponent,
    children: [
      {
        path: '',
        resolve: [listResolve],
        component: ListComponent,
        children: [
          {
            path: 'new-rule',
            pathMatch: 'full',
            component: DetailComponent,
          },
          {
            path: ':ruleId',
            resolve: [listResolve],
            component: DetailComponent,
          },
        ],
      },
    ],
  },
];
