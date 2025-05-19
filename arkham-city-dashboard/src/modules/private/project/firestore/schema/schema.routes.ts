import { ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { SchemaComponent } from './schema.component';
import { ListComponent } from './list/list.component';
import { inject } from '@angular/core';
import { SchemaService } from './schema.service';
import { RouteUtils } from '../../../../../core/utils/route.utils';
import { RecordComponent } from '@modules/private/project/firestore/schema/record/record.component';

export const schemaListResolve = (router: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const service = inject(SchemaService);
  return service.querySchemas(
    RouteUtils.getParam('projectId', router),
    {
      query: RouteUtils.getParam('query', router) != 'all' ? {
        $match: { 'name': RouteUtils.getParam('query', router) },
      } : {},
      page: RouteUtils.getParam('page', router),
      size: RouteUtils.getParam('size', router),
    });
};

export const routes: Routes = [
  {
    path: '',
    component: SchemaComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'all/1/10',
      },
      {
        path: ':query/:page/:size',
        resolve: [schemaListResolve],
        component: ListComponent,
        children: [
          {
            path: ':schema',
            children: [
              {
                path: '',
                pathMatch: 'full',
                redirectTo: 'all/1/10',
              },
              {
                path: ':recordQuery/:recordPage/:recordSize',
                component: RecordComponent,
              },
            ],
          },
        ],
      },
    ],
  },
];
