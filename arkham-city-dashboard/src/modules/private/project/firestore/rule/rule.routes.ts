import { ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { RuleComponent } from './rule.component';
import { ListComponent } from './list/list.component';
import { inject } from '@angular/core';
import { RuleService } from './rule.service';
import { RouteUtils } from '../../../../../core/utils/route.utils';
import { DetailComponent } from './detail/detail.component';
import { forkJoin } from 'rxjs';

export const listResolve = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const ruleService = inject(RuleService);
  const projectId = RouteUtils.getParam('projectId', route);
  return ruleService.all(projectId);
};

export const detailResolve = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const ruleService = inject(RuleService);
  const projectId = RouteUtils.getParam('projectId', route);
  const ruleId = RouteUtils.getParam('ruleId', route);
  return ruleService.get(projectId, ruleId);
};

export const metadataResolve = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const ruleService = inject(RuleService);
  return forkJoin([
    ruleService.getAllRuleTypes(),
    ruleService.getAllRuleConditionTypes(),
  ]);
};

export const routes: Routes = [
  {
    path: '',
    component: RuleComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        resolve: [listResolve],
        component: ListComponent,
      },
      {
        path: 'new-rule',
        pathMatch: 'full',
        resolve: [metadataResolve],
        component: DetailComponent,
      },
      {
        path: ':schema',
        resolve: [metadataResolve],
        component: DetailComponent,
      },
    ],
  },
];
